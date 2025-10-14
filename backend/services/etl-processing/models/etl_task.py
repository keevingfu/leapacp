"""ETL Task Models"""

from enum import Enum
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from uuid import uuid4


class TaskStatus(str, Enum):
    """ETL task execution status"""
    PENDING = "pending"
    EXTRACTING = "extracting"
    TRANSFORMING = "transforming"
    LOADING = "loading"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class ProcessingStage(str, Enum):
    """ETL processing stages"""
    EXTRACT = "extract"
    TRANSFORM = "transform"
    LOAD = "load"


class EntityType(str, Enum):
    """Entity types for knowledge graph"""
    PRODUCT = "Product"
    FEATURE = "Feature"
    SCENARIO = "Scenario"
    PROBLEM = "Problem"
    USER_GROUP = "UserGroup"
    COMPETITOR = "Competitor"
    OFFER = "Offer"
    ORGANIZATION = "Organization"
    PERSON = "Person"
    LOCATION = "Location"
    KEYWORD = "Keyword"


class RelationType(str, Enum):
    """Relationship types for knowledge graph"""
    HAS_FEATURE = "HAS_FEATURE"
    SOLVES = "SOLVES"
    APPLIES_TO = "APPLIES_TO"
    TARGETS = "TARGETS"
    COMPETES_WITH = "COMPETES_WITH"
    HAS_OFFER = "HAS_OFFER"
    WORKS_FOR = "WORKS_FOR"
    LOCATED_IN = "LOCATED_IN"
    RELATED_TO = "RELATED_TO"
    MENTIONS = "MENTIONS"


class ExtractedEntity(BaseModel):
    """Extracted entity from text"""
    text: str = Field(..., description="Entity text")
    type: EntityType = Field(..., description="Entity type")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ExtractedRelationship(BaseModel):
    """Extracted relationship between entities"""
    source_entity: str = Field(..., description="Source entity text")
    target_entity: str = Field(..., description="Target entity text")
    relation_type: RelationType = Field(..., description="Relationship type")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ProcessedData(BaseModel):
    """Processed data result"""
    raw_text: str = Field(..., description="Original raw text")
    cleaned_text: str = Field(..., description="Cleaned text")
    entities: List[ExtractedEntity] = Field(default_factory=list)
    relationships: List[ExtractedRelationship] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    processed_at: datetime = Field(default_factory=datetime.utcnow)


class ETLTask(BaseModel):
    """ETL processing task"""
    task_id: str = Field(default_factory=lambda: str(uuid4()))
    name: str = Field(..., description="Task name")
    collection_task_id: str = Field(..., description="Source data collection task ID")
    status: TaskStatus = Field(default=TaskStatus.PENDING)
    stage: Optional[ProcessingStage] = Field(default=None)
    progress: float = Field(default=0.0, ge=0.0, le=100.0)

    # Processing results
    extracted_count: int = Field(default=0, description="Number of entities extracted")
    transformed_count: int = Field(default=0, description="Number of entities transformed")
    loaded_count: int = Field(default=0, description="Number of entities loaded to graph")
    error_count: int = Field(default=0, description="Number of errors encountered")

    # Data
    result: Optional[ProcessedData] = Field(default=None)
    error: Optional[str] = Field(default=None)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    # Metadata
    metadata: Dict[str, Any] = Field(default_factory=dict)


class GraphLoadResult(BaseModel):
    """Result of loading data to graph database"""
    entities_created: int = Field(default=0)
    relationships_created: int = Field(default=0)
    entities_updated: int = Field(default=0)
    errors: List[str] = Field(default_factory=list)
    duration_seconds: float = Field(default=0.0)
