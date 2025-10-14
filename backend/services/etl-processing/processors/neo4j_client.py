"""Neo4j Client for Graph Database Operations"""

from typing import List, Dict, Any
from neo4j import GraphDatabase, AsyncGraphDatabase
from datetime import datetime

from config import get_settings
from models.etl_task import ExtractedEntity, ExtractedRelationship, GraphLoadResult


class Neo4jClient:
    """Neo4j database client"""

    def __init__(self):
        self.settings = get_settings()
        self.driver = None

    async def connect(self):
        """Connect to Neo4j"""
        self.driver = GraphDatabase.driver(
            self.settings.NEO4J_URI,
            auth=(self.settings.NEO4J_USER, self.settings.NEO4J_PASSWORD)
        )

    async def close(self):
        """Close connection"""
        if self.driver:
            self.driver.close()

    async def load_entities(
        self,
        entities: List[ExtractedEntity]
    ) -> GraphLoadResult:
        """Load entities to graph database"""
        if not self.driver:
            await self.connect()

        result = GraphLoadResult()
        start_time = datetime.utcnow()

        with self.driver.session(database=self.settings.NEO4J_DATABASE) as session:
            for entity in entities:
                try:
                    # Create or merge entity node
                    query = f"""
                    MERGE (n:{entity.type.value} {{name: $name}})
                    ON CREATE SET
                        n.created_at = datetime(),
                        n.confidence = $confidence,
                        n.metadata = $metadata
                    ON MATCH SET
                        n.updated_at = datetime(),
                        n.confidence = $confidence
                    RETURN n
                    """

                    session.run(
                        query,
                        name=entity.text,
                        confidence=entity.confidence,
                        metadata=entity.metadata
                    )

                    result.entities_created += 1

                except Exception as e:
                    result.errors.append(f"Entity {entity.text}: {str(e)}")

        end_time = datetime.utcnow()
        result.duration_seconds = (end_time - start_time).total_seconds()

        return result

    async def load_relationships(
        self,
        relationships: List[ExtractedRelationship]
    ) -> GraphLoadResult:
        """Load relationships to graph database"""
        if not self.driver:
            await self.connect()

        result = GraphLoadResult()
        start_time = datetime.utcnow()

        with self.driver.session(database=self.settings.NEO4J_DATABASE) as session:
            for rel in relationships:
                try:
                    # Create relationship between nodes
                    query = f"""
                    MATCH (a {{name: $source}})
                    MATCH (b {{name: $target}})
                    MERGE (a)-[r:{rel.relation_type.value}]->(b)
                    ON CREATE SET
                        r.created_at = datetime(),
                        r.confidence = $confidence,
                        r.metadata = $metadata
                    RETURN r
                    """

                    session.run(
                        query,
                        source=rel.source_entity,
                        target=rel.target_entity,
                        confidence=rel.confidence,
                        metadata=rel.metadata
                    )

                    result.relationships_created += 1

                except Exception as e:
                    result.errors.append(
                        f"Relationship {rel.source_entity}->{rel.target_entity}: {str(e)}"
                    )

        end_time = datetime.utcnow()
        result.duration_seconds = (end_time - start_time).total_seconds()

        return result

    async def health_check(self) -> bool:
        """Check Neo4j connection health"""
        try:
            if not self.driver:
                await self.connect()

            with self.driver.session(database=self.settings.NEO4J_DATABASE) as session:
                result = session.run("RETURN 1 as num")
                return result.single()["num"] == 1

        except Exception:
            return False
