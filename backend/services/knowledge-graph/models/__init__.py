"""
Data models for Knowledge Graph Service
"""
from .entities import (
    EntityType,
    BaseEntity,
    Product,
    Feature,
    Scenario,
    Problem,
    UserGroup,
    Competitor,
    Offer,
    Merchant
)

from .relationships import (
    RelationshipType,
    BaseRelationship,
    HasFeature,
    Solves,
    AppliesTo,
    Targets
)

__all__ = [
    # Entity types
    "EntityType",
    "BaseEntity",
    "Product",
    "Feature",
    "Scenario",
    "Problem",
    "UserGroup",
    "Competitor",
    "Offer",
    "Merchant",
    # Relationship types
    "RelationshipType",
    "BaseRelationship",
    "HasFeature",
    "Solves",
    "AppliesTo",
    "Targets"
]
