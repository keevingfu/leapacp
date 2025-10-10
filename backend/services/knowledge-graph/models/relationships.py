"""
Relationship models for Knowledge Graph
Defines the types of relationships between entities
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from enum import Enum


class RelationshipType(str, Enum):
    """Supported relationship types in the knowledge graph"""
    HAS_FEATURE = "HAS_FEATURE"           # Product → Feature
    SOLVES = "SOLVES"                     # Feature → Problem
    APPLIES_TO = "APPLIES_TO"             # Product → Scenario
    TARGETS = "TARGETS"                   # Product → UserGroup
    COMPARES_WITH = "COMPARES_WITH"       # Product → Competitor
    HAS_OFFER = "HAS_OFFER"               # Product → Offer
    SOLD_BY = "SOLD_BY"                   # Offer → Merchant
    GENERATED_FROM = "GENERATED_FROM"     # Content → Product


class BaseRelationship(BaseModel):
    """Base relationship model"""
    from_id: str = Field(..., description="Source entity ID")
    to_id: str = Field(..., description="Target entity ID")
    rel_type: RelationshipType = Field(..., description="Relationship type")
    properties: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional relationship properties"
    )


class HasFeature(BaseRelationship):
    """
    Product HAS_FEATURE Feature
    Example: Cool Mattress Queen HAS_FEATURE Gel-infused Memory Foam
    """
    rel_type: RelationshipType = Field(
        default=RelationshipType.HAS_FEATURE,
        description="Relationship type"
    )
    confidence: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="Confidence score that product has this feature (0.0-1.0)"
    )


class Solves(BaseRelationship):
    """
    Feature SOLVES Problem
    Example: Gel-infused Memory Foam SOLVES Night Sweats
    """
    rel_type: RelationshipType = Field(
        default=RelationshipType.SOLVES,
        description="Relationship type"
    )
    effectiveness: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="Effectiveness score of feature solving problem (0.0-1.0)"
    )


class AppliesTo(BaseRelationship):
    """
    Product APPLIES_TO Scenario
    Example: Cool Mattress Queen APPLIES_TO Summer Sleep
    """
    rel_type: RelationshipType = Field(
        default=RelationshipType.APPLIES_TO,
        description="Relationship type"
    )
    relevance: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="Relevance score of product to scenario (0.0-1.0)"
    )


class Targets(BaseRelationship):
    """
    Product TARGETS UserGroup
    Example: Cool Mattress Queen TARGETS Hot Sleepers
    """
    rel_type: RelationshipType = Field(
        default=RelationshipType.TARGETS,
        description="Relationship type"
    )
    priority: int = Field(
        default=1,
        ge=1,
        description="Priority ranking (1 = highest priority)"
    )


class ComparesWith(BaseRelationship):
    """
    Product COMPARES_WITH Competitor
    Example: Cool Mattress Queen COMPARES_WITH Purple Mattress
    """
    rel_type: RelationshipType = Field(
        default=RelationshipType.COMPARES_WITH,
        description="Relationship type"
    )
    comparison_type: str = Field(
        default="alternative",
        description="Type of comparison: alternative, similar, superior, inferior"
    )


class HasOffer(BaseRelationship):
    """
    Product HAS_OFFER Offer
    Example: Cool Mattress Queen HAS_OFFER offer_xyz
    """
    rel_type: RelationshipType = Field(
        default=RelationshipType.HAS_OFFER,
        description="Relationship type"
    )


class SoldBy(BaseRelationship):
    """
    Offer SOLD_BY Merchant
    Example: offer_xyz SOLD_BY SweetNight Official
    """
    rel_type: RelationshipType = Field(
        default=RelationshipType.SOLD_BY,
        description="Relationship type"
    )


class GeneratedFrom(BaseRelationship):
    """
    Content GENERATED_FROM Product
    Example: content_123 GENERATED_FROM Cool Mattress Queen
    """
    rel_type: RelationshipType = Field(
        default=RelationshipType.GENERATED_FROM,
        description="Relationship type"
    )
