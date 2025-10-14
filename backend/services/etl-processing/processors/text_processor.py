"""Text Processing and Entity Extraction"""

import re
from typing import List, Tuple
from bs4 import BeautifulSoup

from models.etl_task import ExtractedEntity, ExtractedRelationship, EntityType, RelationType


class TextProcessor:
    """Process and extract entities from text"""

    def __init__(self):
        """Initialize text processor"""
        # Simple keyword-based entity extraction (can be replaced with spaCy later)
        self.entity_keywords = {
            EntityType.PRODUCT: ["product", "service", "tool", "platform", "software"],
            EntityType.FEATURE: ["feature", "capability", "function", "functionality"],
            EntityType.PROBLEM: ["problem", "issue", "challenge", "difficulty"],
            EntityType.SCENARIO: ["scenario", "use case", "situation"],
        }

    def clean_html(self, html_text: str) -> str:
        """Clean HTML tags from text"""
        soup = BeautifulSoup(html_text, "lxml")
        return soup.get_text(separator=" ", strip=True)

    def clean_markdown(self, markdown_text: str) -> str:
        """Clean markdown formatting"""
        # Remove markdown links
        text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', markdown_text)
        # Remove markdown headers
        text = re.sub(r'^#+\s+', '', text, flags=re.MULTILINE)
        # Remove markdown emphasis
        text = re.sub(r'[*_]{1,2}([^*_]+)[*_]{1,2}', r'\1', text)
        return text.strip()

    def clean_text(self, text: str) -> str:
        """General text cleaning"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters
        text = re.sub(r'[^\w\s\.\,\;\:\!\?]', '', text)
        return text.strip()

    def extract_entities_simple(self, text: str) -> List[ExtractedEntity]:
        """
        Simple keyword-based entity extraction
        NOTE: This is a simplified version. Production should use spaCy NER
        """
        entities = []
        text_lower = text.lower()

        # Extract sentences
        sentences = re.split(r'[\.!?]', text)

        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue

            sentence_lower = sentence.lower()

            # Check for product keywords
            for entity_type, keywords in self.entity_keywords.items():
                for keyword in keywords:
                    if keyword in sentence_lower:
                        # Extract the noun phrase containing the keyword
                        entity_text = self._extract_noun_phrase(sentence, keyword)
                        if entity_text:
                            entities.append(ExtractedEntity(
                                text=entity_text,
                                type=entity_type,
                                confidence=0.8,  # Simple confidence score
                                metadata={"source_sentence": sentence}
                            ))

        return entities

    def _extract_noun_phrase(self, sentence: str, keyword: str) -> str:
        """Extract noun phrase around keyword (simplified)"""
        words = sentence.split()
        keyword_lower = keyword.lower()

        for i, word in enumerate(words):
            if keyword_lower in word.lower():
                # Take 2 words before and after
                start = max(0, i - 2)
                end = min(len(words), i + 3)
                phrase = " ".join(words[start:end])
                return phrase.strip()

        return keyword

    def extract_relationships_simple(
        self,
        text: str,
        entities: List[ExtractedEntity]
    ) -> List[ExtractedRelationship]:
        """
        Simple relationship extraction based on co-occurrence
        NOTE: This is a simplified version. Production should use dependency parsing
        """
        relationships = []

        # Extract sentences
        sentences = re.split(r'[\.!?]', text)

        for sentence in sentences:
            sentence_lower = sentence.lower()

            # Find entities in this sentence
            entities_in_sentence = [
                e for e in entities
                if e.text.lower() in sentence_lower
            ]

            # Create relationships based on co-occurrence
            if len(entities_in_sentence) >= 2:
                for i in range(len(entities_in_sentence) - 1):
                    source = entities_in_sentence[i]
                    target = entities_in_sentence[i + 1]

                    # Determine relationship type based on entity types
                    rel_type = self._infer_relationship_type(
                        source.type, target.type, sentence_lower
                    )

                    if rel_type:
                        relationships.append(ExtractedRelationship(
                            source_entity=source.text,
                            target_entity=target.text,
                            relation_type=rel_type,
                            confidence=0.7,
                            metadata={"source_sentence": sentence}
                        ))

        return relationships

    def _infer_relationship_type(
        self,
        source_type: EntityType,
        target_type: EntityType,
        sentence: str
    ) -> RelationType:
        """Infer relationship type based on entity types and sentence context"""
        # Simple rule-based relationship inference
        if source_type == EntityType.PRODUCT and target_type == EntityType.FEATURE:
            return RelationType.HAS_FEATURE
        elif source_type == EntityType.PRODUCT and target_type == EntityType.PROBLEM:
            if any(word in sentence for word in ["solve", "fix", "address"]):
                return RelationType.SOLVES
        elif source_type == EntityType.PRODUCT and target_type == EntityType.SCENARIO:
            return RelationType.APPLIES_TO

        # Default to generic relationship
        return RelationType.RELATED_TO
