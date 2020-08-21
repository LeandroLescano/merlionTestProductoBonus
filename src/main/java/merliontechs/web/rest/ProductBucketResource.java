package merliontechs.web.rest;

import merliontechs.domain.ProductBucket;
import merliontechs.repository.ProductBucketRepository;
import merliontechs.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link merliontechs.domain.ProductBucket}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProductBucketResource {

    private final Logger log = LoggerFactory.getLogger(ProductBucketResource.class);

    private static final String ENTITY_NAME = "productBucket";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductBucketRepository productBucketRepository;

    public ProductBucketResource(ProductBucketRepository productBucketRepository) {
        this.productBucketRepository = productBucketRepository;
    }

    /**
     * {@code POST  /product-buckets} : Create a new productBucket.
     *
     * @param productBucket the productBucket to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productBucket, or with status {@code 400 (Bad Request)} if the productBucket has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-buckets")
    public ResponseEntity<ProductBucket> createProductBucket(@Valid @RequestBody ProductBucket productBucket) throws URISyntaxException {
        log.debug("REST request to save ProductBucket : {}", productBucket);
        if (productBucket.getId() != null) {
            throw new BadRequestAlertException("A new productBucket cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductBucket result = productBucketRepository.save(productBucket);
        return ResponseEntity.created(new URI("/api/product-buckets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-buckets} : Updates an existing productBucket.
     *
     * @param productBucket the productBucket to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productBucket,
     * or with status {@code 400 (Bad Request)} if the productBucket is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productBucket couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-buckets")
    public ResponseEntity<ProductBucket> updateProductBucket(@Valid @RequestBody ProductBucket productBucket) throws URISyntaxException {
        log.debug("REST request to update ProductBucket : {}", productBucket);
        if (productBucket.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductBucket result = productBucketRepository.save(productBucket);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productBucket.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /product-buckets} : get all the productBuckets.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productBuckets in body.
     */
    @GetMapping("/product-buckets")
    public List<ProductBucket> getAllProductBuckets() {
        log.debug("REST request to get all ProductBuckets");
        return productBucketRepository.findAll();
    }

    /**
     * {@code GET  /product-buckets/:id} : get the "id" productBucket.
     *
     * @param id the id of the productBucket to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productBucket, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-buckets/{id}")
    public ResponseEntity<ProductBucket> getProductBucket(@PathVariable Long id) {
        log.debug("REST request to get ProductBucket : {}", id);
        Optional<ProductBucket> productBucket = productBucketRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productBucket);
    }

    /**
     * {@code DELETE  /product-buckets/:id} : delete the "id" productBucket.
     *
     * @param id the id of the productBucket to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-buckets/{id}")
    public ResponseEntity<Void> deleteProductBucket(@PathVariable Long id) {
        log.debug("REST request to delete ProductBucket : {}", id);
        productBucketRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
