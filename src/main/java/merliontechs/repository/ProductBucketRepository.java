package merliontechs.repository;

import merliontechs.domain.ProductBucket;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ProductBucket entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductBucketRepository extends JpaRepository<ProductBucket, Long> {
}
