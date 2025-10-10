"""
Neo4j Graph Database Service

This service provides a high-level interface for managing entities and relationships
in the Neo4j knowledge graph database.
"""
from neo4j import GraphDatabase
from typing import List, Dict, Optional, Any
import logging

logger = logging.getLogger(__name__)


class GraphService:
    """Neo4j graph database service with transaction support"""

    def __init__(self, uri: str, user: str, password: str):
        """
        Initialize Neo4j driver with connection pooling

        Args:
            uri: Neo4j connection URI (e.g., bolt://localhost:7687)
            user: Database username
            password: Database password
        """
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
        logger.info(f"Connected to Neo4j at {uri}")

    def close(self):
        """Close driver connection and release resources"""
        if self.driver:
            self.driver.close()
            logger.info("Neo4j connection closed")

    def health_check(self) -> bool:
        """
        Verify database connectivity

        Returns:
            True if database is accessible, False otherwise
        """
        try:
            with self.driver.session() as session:
                result = session.run("RETURN 1 as test")
                return result.single()["test"] == 1
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return False

    def create_entity(self, entity_type: str, properties: Dict[str, Any]) -> str:
        """
        Create entity node in Neo4j

        Args:
            entity_type: Entity type (used as node label)
            properties: Entity properties including 'id'

        Returns:
            Entity ID

        Raises:
            ValueError: If entity_type is invalid or properties missing 'id'
            Exception: If creation fails
        """
        # Validate entity type (prevent injection)
        valid_types = ["Product", "Feature", "Scenario", "Problem",
                      "UserGroup", "Competitor", "Offer", "Merchant"]
        if entity_type not in valid_types:
            raise ValueError(f"Invalid entity type: {entity_type}")

        if "id" not in properties:
            raise ValueError("Entity properties must include 'id' field")

        try:
            with self.driver.session() as session:
                entity_id = session.execute_write(
                    self._create_entity_tx,
                    entity_type,
                    properties
                )
                logger.info(f"Created entity: {entity_type} with id={entity_id}")
                return entity_id
        except Exception as e:
            logger.error(f"Failed to create entity: {e}", exc_info=True)
            raise

    def query_entity(self, entity_id: str) -> Optional[Dict[str, Any]]:
        """
        Query entity by ID

        Args:
            entity_id: Entity identifier

        Returns:
            Entity properties dict or None if not found
        """
        try:
            with self.driver.session() as session:
                result = session.execute_read(
                    self._query_entity_tx,
                    entity_id
                )
                return result
        except Exception as e:
            logger.error(f"Failed to query entity {entity_id}: {e}", exc_info=True)
            return None

    def update_entity(self, entity_id: str, properties: Dict[str, Any]) -> bool:
        """
        Update entity properties

        Args:
            entity_id: Entity identifier
            properties: Properties to update

        Returns:
            True if successful, False otherwise
        """
        try:
            with self.driver.session() as session:
                success = session.execute_write(
                    self._update_entity_tx,
                    entity_id,
                    properties
                )
                if success:
                    logger.info(f"Updated entity: {entity_id}")
                return success
        except Exception as e:
            logger.error(f"Failed to update entity {entity_id}: {e}", exc_info=True)
            return False

    def delete_entity(self, entity_id: str) -> bool:
        """
        Delete entity and all its relationships

        Args:
            entity_id: Entity identifier

        Returns:
            True if deleted, False if not found
        """
        try:
            with self.driver.session() as session:
                deleted = session.execute_write(
                    self._delete_entity_tx,
                    entity_id
                )
                if deleted:
                    logger.info(f"Deleted entity: {entity_id}")
                return deleted
        except Exception as e:
            logger.error(f"Failed to delete entity {entity_id}: {e}", exc_info=True)
            return False

    def create_relationship(
        self,
        from_id: str,
        to_id: str,
        rel_type: str,
        properties: Dict[str, Any] = None
    ) -> bool:
        """
        Create relationship between entities

        Args:
            from_id: Source entity ID
            to_id: Target entity ID
            rel_type: Relationship type
            properties: Optional relationship properties

        Returns:
            True if successful, False otherwise
        """
        if properties is None:
            properties = {}

        # Validate relationship type
        valid_types = ["HAS_FEATURE", "SOLVES", "APPLIES_TO", "TARGETS",
                      "COMPARES_WITH", "HAS_OFFER", "SOLD_BY", "GENERATED_FROM"]
        if rel_type not in valid_types:
            raise ValueError(f"Invalid relationship type: {rel_type}")

        try:
            with self.driver.session() as session:
                success = session.execute_write(
                    self._create_relationship_tx,
                    from_id,
                    to_id,
                    rel_type,
                    properties
                )
                if success:
                    logger.info(f"Created relationship: {from_id} -{rel_type}-> {to_id}")
                return success
        except Exception as e:
            logger.error(f"Failed to create relationship: {e}", exc_info=True)
            return False

    def delete_relationship(self, from_id: str, to_id: str, rel_type: str) -> bool:
        """
        Delete specific relationship between entities

        Args:
            from_id: Source entity ID
            to_id: Target entity ID
            rel_type: Relationship type

        Returns:
            True if deleted, False if not found
        """
        try:
            with self.driver.session() as session:
                deleted = session.execute_write(
                    self._delete_relationship_tx,
                    from_id,
                    to_id,
                    rel_type
                )
                if deleted:
                    logger.info(f"Deleted relationship: {from_id} -{rel_type}-> {to_id}")
                return deleted
        except Exception as e:
            logger.error(f"Failed to delete relationship: {e}", exc_info=True)
            return False

    def query_relationships(
        self,
        entity_id: str,
        rel_type: Optional[str] = None,
        direction: str = "outgoing"
    ) -> List[Dict[str, Any]]:
        """
        Query entity relationships

        Args:
            entity_id: Entity identifier
            rel_type: Optional relationship type filter
            direction: 'outgoing', 'incoming', or 'both'

        Returns:
            List of relationship dictionaries
        """
        try:
            with self.driver.session() as session:
                results = session.execute_read(
                    self._query_relationships_tx,
                    entity_id,
                    rel_type,
                    direction
                )
                return results
        except Exception as e:
            logger.error(f"Failed to query relationships for {entity_id}: {e}", exc_info=True)
            return []

    def search_entities(
        self,
        entity_type: Optional[str] = None,
        search_text: Optional[str] = None,
        properties: Optional[Dict[str, Any]] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Search entities by type, text, or properties

        Args:
            entity_type: Optional entity type filter
            search_text: Optional text search on name/description
            properties: Optional property filters
            limit: Maximum results (default 100)

        Returns:
            List of matching entities
        """
        try:
            with self.driver.session() as session:
                results = session.execute_read(
                    self._search_entities_tx,
                    entity_type,
                    search_text,
                    properties,
                    limit
                )
                return results
        except Exception as e:
            logger.error(f"Failed to search entities: {e}", exc_info=True)
            return []

    def execute_cypher(self, query: str, params: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Execute custom Cypher query

        Args:
            query: Cypher query string
            params: Query parameters

        Returns:
            List of result dictionaries

        Raises:
            ValueError: If query contains dangerous operations
        """
        if params is None:
            params = {}

        # Basic safety check (enhance for production)
        dangerous_keywords = ["DROP", "DELETE ALL", "REMOVE ALL"]
        query_upper = query.upper()
        for keyword in dangerous_keywords:
            if keyword in query_upper:
                raise ValueError(f"Query contains dangerous operation: {keyword}")

        try:
            with self.driver.session() as session:
                result = session.run(query, **params)
                records = []
                for record in result:
                    records.append(dict(record))
                logger.info(f"Executed custom query, returned {len(records)} results")
                return records
        except Exception as e:
            logger.error(f"Failed to execute cypher query: {e}", exc_info=True)
            raise

    # Transaction functions (static methods)

    @staticmethod
    def _create_entity_tx(tx, entity_type: str, properties: Dict[str, Any]) -> str:
        """Transaction function for creating entity"""
        query = f"CREATE (n:{entity_type} $properties) RETURN n.id as id"
        result = tx.run(query, properties=properties)
        return result.single()["id"]

    @staticmethod
    def _query_entity_tx(tx, entity_id: str) -> Optional[Dict[str, Any]]:
        """Transaction function for querying entity"""
        query = "MATCH (n) WHERE n.id = $id RETURN n"
        result = tx.run(query, id=entity_id)
        record = result.single()
        if record:
            node = record["n"]
            # Convert node to dictionary
            return dict(node)
        return None

    @staticmethod
    def _update_entity_tx(tx, entity_id: str, properties: Dict[str, Any]) -> bool:
        """Transaction function for updating entity"""
        # Build SET clause dynamically
        set_clauses = [f"n.{key} = $props.{key}" for key in properties.keys()]
        set_clause = ", ".join(set_clauses)

        query = f"MATCH (n) WHERE n.id = $id SET {set_clause} RETURN n"
        result = tx.run(query, id=entity_id, props=properties)
        return result.single() is not None

    @staticmethod
    def _delete_entity_tx(tx, entity_id: str) -> bool:
        """Transaction function for deleting entity"""
        query = "MATCH (n) WHERE n.id = $id DETACH DELETE n RETURN count(n) as deleted"
        result = tx.run(query, id=entity_id)
        count = result.single()["deleted"]
        return count > 0

    @staticmethod
    def _create_relationship_tx(
        tx,
        from_id: str,
        to_id: str,
        rel_type: str,
        properties: Dict[str, Any]
    ) -> bool:
        """Transaction function for creating relationship"""
        query = f"""
        MATCH (from) WHERE from.id = $from_id
        MATCH (to) WHERE to.id = $to_id
        CREATE (from)-[r:{rel_type} $properties]->(to)
        RETURN r
        """
        result = tx.run(query, from_id=from_id, to_id=to_id, properties=properties)
        return result.single() is not None

    @staticmethod
    def _delete_relationship_tx(tx, from_id: str, to_id: str, rel_type: str) -> bool:
        """Transaction function for deleting relationship"""
        query = f"""
        MATCH (from)-[r:{rel_type}]->(to)
        WHERE from.id = $from_id AND to.id = $to_id
        DELETE r
        RETURN count(r) as deleted
        """
        result = tx.run(query, from_id=from_id, to_id=to_id)
        count = result.single()["deleted"]
        return count > 0

    @staticmethod
    def _query_relationships_tx(
        tx,
        entity_id: str,
        rel_type: Optional[str],
        direction: str
    ) -> List[Dict[str, Any]]:
        """Transaction function for querying relationships"""
        relationships = []

        if direction in ["outgoing", "both"]:
            if rel_type:
                query = f"""
                MATCH (n)-[r:{rel_type}]->(target)
                WHERE n.id = $id
                RETURN type(r) as rel_type, properties(r) as properties, target
                """
            else:
                query = """
                MATCH (n)-[r]->(target)
                WHERE n.id = $id
                RETURN type(r) as rel_type, properties(r) as properties, target
                """
            result = tx.run(query, id=entity_id)
            for record in result:
                relationships.append({
                    "direction": "outgoing",
                    "type": record["rel_type"],
                    "properties": dict(record["properties"]),
                    "target": dict(record["target"])
                })

        if direction in ["incoming", "both"]:
            if rel_type:
                query = f"""
                MATCH (source)-[r:{rel_type}]->(n)
                WHERE n.id = $id
                RETURN type(r) as rel_type, properties(r) as properties, source
                """
            else:
                query = """
                MATCH (source)-[r]->(n)
                WHERE n.id = $id
                RETURN type(r) as rel_type, properties(r) as properties, source
                """
            result = tx.run(query, id=entity_id)
            for record in result:
                relationships.append({
                    "direction": "incoming",
                    "type": record["rel_type"],
                    "properties": dict(record["properties"]),
                    "source": dict(record["source"])
                })

        return relationships

    @staticmethod
    def _search_entities_tx(
        tx,
        entity_type: Optional[str],
        search_text: Optional[str],
        properties: Optional[Dict[str, Any]],
        limit: int
    ) -> List[Dict[str, Any]]:
        """Transaction function for searching entities"""
        # Build query dynamically
        where_clauses = []
        params = {"limit": limit}

        if entity_type:
            label_filter = f"n:{entity_type}"
        else:
            label_filter = "n"

        if search_text:
            where_clauses.append("(n.name CONTAINS $search_text OR n.description CONTAINS $search_text)")
            params["search_text"] = search_text

        if properties:
            for key, value in properties.items():
                where_clauses.append(f"n.{key} = $prop_{key}")
                params[f"prop_{key}"] = value

        where_clause = " AND ".join(where_clauses) if where_clauses else "true"

        query = f"MATCH ({label_filter}) WHERE {where_clause} RETURN n LIMIT $limit"
        result = tx.run(query, **params)

        entities = []
        for record in result:
            entities.append(dict(record["n"]))

        return entities
