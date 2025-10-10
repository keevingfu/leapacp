"""
Entity models for Knowledge Graph
All entities use Pydantic v2 for validation and serialization
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from enum import Enum
from datetime import datetime


class EntityType(str, Enum):
    """Supported entity types in the knowledge graph"""
    PRODUCT = "Product"
    FEATURE = "Feature"
    SCENARIO = "Scenario"
    PROBLEM = "Problem"
    USER_GROUP = "UserGroup"
    COMPETITOR = "Competitor"
    OFFER = "Offer"
    MERCHANT = "Merchant"


class BaseEntity(BaseModel):
    """Base entity model with common fields"""
    id: str = Field(..., description="Unique entity identifier")
    name: str = Field(..., description="Entity name", min_length=1)
    description: Optional[str] = Field(None, description="Entity description")
    created_at: Optional[str] = Field(
        default_factory=lambda: datetime.utcnow().isoformat(),
        description="Creation timestamp in ISO 8601 format"
    )
    updated_at: Optional[str] = Field(
        default_factory=lambda: datetime.utcnow().isoformat(),
        description="Last update timestamp in ISO 8601 format"
    )


class Product(BaseEntity):
    """
    Product entity representing a sellable item
    Example: Cool Mattress Queen, Memory Foam Pillow
    """
    sku: str = Field(..., description="Stock keeping unit", min_length=1)
    category: str = Field(..., description="Product category", min_length=1)
    brand: str = Field(..., description="Brand name", min_length=1)
    price_range: Optional[Dict[str, float]] = Field(
        None,
        description="Min/max price range, e.g. {'min': 99.99, 'max': 299.99}"
    )


class Feature(BaseEntity):
    """
    Feature entity representing product characteristics
    Example: Gel-infused Memory Foam, Cooling Technology
    """
    feature_type: str = Field(
        ...,
        description="Feature type: material, technology, benefit, etc."
    )
    value: Optional[str] = Field(None, description="Feature value if applicable")
    importance_score: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
        description="Importance score from 0.0 to 1.0"
    )


class Scenario(BaseEntity):
    """
    Scenario entity representing usage contexts
    Example: Summer Sleep, Back Pain Relief, Hot Sleepers
    """
    tags: List[str] = Field(
        default_factory=list,
        description="List of tags describing the scenario"
    )


class Problem(BaseEntity):
    """
    Problem entity representing user pain points
    Example: Night Sweats, Back Pain, Poor Sleep Quality
    """
    severity: str = Field(
        ...,
        description="Problem severity: low, medium, high"
    )
    frequency: str = Field(
        ...,
        description="Problem frequency: rare, common, frequent"
    )


class UserGroup(BaseEntity):
    """
    User group entity representing target audience segments
    Example: Hot Sleepers, Athletes, Side Sleepers
    """
    demographics: Dict[str, Any] = Field(
        default_factory=dict,
        description="Demographic data (age, gender, location, etc.)"
    )
    behavior: Dict[str, Any] = Field(
        default_factory=dict,
        description="Behavioral data (preferences, habits, etc.)"
    )


class Competitor(BaseEntity):
    """
    Competitor entity representing competing products/brands
    Example: Purple Mattress, Casper, Tempur-Pedic
    """
    brand: str = Field(..., description="Competitor brand name")
    product: str = Field(..., description="Competitor product name")
    price_range: Optional[Dict[str, float]] = Field(
        None,
        description="Competitor price range"
    )


class Offer(BaseEntity):
    """
    Offer entity representing sellable product offers
    Contains pricing, availability, and merchant information
    """
    offer_id: str = Field(..., description="Unique offer identifier")
    sku: str = Field(..., description="Product SKU this offer is for")
    merchant_id: str = Field(..., description="Merchant providing this offer")
    price: float = Field(..., gt=0, description="Offer price (must be positive)")
    currency: str = Field(
        ...,
        min_length=3,
        max_length=3,
        description="ISO 4217 currency code (e.g., USD, EUR)"
    )
    availability: bool = Field(..., description="Whether offer is currently available")
    stock_level: Optional[int] = Field(
        None,
        ge=0,
        description="Stock level if available"
    )
    valid_from: str = Field(
        ...,
        description="Offer valid from datetime in ISO 8601 format"
    )
    valid_until: str = Field(
        ...,
        description="Offer valid until datetime in ISO 8601 format"
    )
    region: str = Field(
        ...,
        min_length=2,
        max_length=2,
        description="ISO 3166-1 alpha-2 region code (e.g., US, GB)"
    )


class Merchant(BaseEntity):
    """
    Merchant entity representing sellers/vendors
    Example: SweetNight Official, Amazon, Shopify Store
    """
    merchant_id: str = Field(..., description="Unique merchant identifier")
    platform: str = Field(
        ...,
        description="Platform: shopify, etsy, amazon, custom, etc."
    )
    mor: bool = Field(
        default=False,
        description="Whether merchant is Merchant of Record"
    )
    commission_rate: Optional[float] = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Commission rate from 0.0 to 1.0"
    )
