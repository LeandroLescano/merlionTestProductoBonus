package merliontechs.web.rest;

import merliontechs.TestApp;
import merliontechs.domain.ProductBucket;
import merliontechs.repository.ProductBucketRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ProductBucketResource} REST controller.
 */
@SpringBootTest(classes = TestApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class ProductBucketResourceIT {

    private static final BigDecimal DEFAULT_AVAILABLE_TO_SELL_QUANTITY = new BigDecimal(10);
    private static final BigDecimal UPDATED_AVAILABLE_TO_SELL_QUANTITY = new BigDecimal(9);

    private static final BigDecimal DEFAULT_IN_CHARGE_QUANTITY = new BigDecimal(3);
    private static final BigDecimal UPDATED_IN_CHARGE_QUANTITY = new BigDecimal(2);

    private static final BigDecimal DEFAULT_BROKEN_QUANTITY = new BigDecimal(2);
    private static final BigDecimal UPDATED_BROKEN_QUANTITY = new BigDecimal(1);

    @Autowired
    private ProductBucketRepository productBucketRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductBucketMockMvc;

    private ProductBucket productBucket;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductBucket createEntity(EntityManager em) {
        ProductBucket productBucket = new ProductBucket()
            .availableToSellQuantity(DEFAULT_AVAILABLE_TO_SELL_QUANTITY)
            .inChargeQuantity(DEFAULT_IN_CHARGE_QUANTITY)
            .brokenQuantity(DEFAULT_BROKEN_QUANTITY);
        return productBucket;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductBucket createUpdatedEntity(EntityManager em) {
        ProductBucket productBucket = new ProductBucket()
            .availableToSellQuantity(UPDATED_AVAILABLE_TO_SELL_QUANTITY)
            .inChargeQuantity(UPDATED_IN_CHARGE_QUANTITY)
            .brokenQuantity(UPDATED_BROKEN_QUANTITY);
        return productBucket;
    }

    @BeforeEach
    public void initTest() {
        productBucket = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductBucket() throws Exception {
        int databaseSizeBeforeCreate = productBucketRepository.findAll().size();
        // Create the ProductBucket
        restProductBucketMockMvc.perform(post("/api/product-buckets")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productBucket)))
            .andExpect(status().isCreated());

        // Validate the ProductBucket in the database
        List<ProductBucket> productBucketList = productBucketRepository.findAll();
        assertThat(productBucketList).hasSize(databaseSizeBeforeCreate + 1);
        ProductBucket testProductBucket = productBucketList.get(productBucketList.size() - 1);
        assertThat(testProductBucket.getAvailableToSellQuantity()).isEqualTo(DEFAULT_AVAILABLE_TO_SELL_QUANTITY);
        assertThat(testProductBucket.getInChargeQuantity()).isEqualTo(DEFAULT_IN_CHARGE_QUANTITY);
        assertThat(testProductBucket.getBrokenQuantity()).isEqualTo(DEFAULT_BROKEN_QUANTITY);
    }

    @Test
    @Transactional
    public void createProductBucketWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productBucketRepository.findAll().size();

        // Create the ProductBucket with an existing ID
        productBucket.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductBucketMockMvc.perform(post("/api/product-buckets")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productBucket)))
            .andExpect(status().isBadRequest());

        // Validate the ProductBucket in the database
        List<ProductBucket> productBucketList = productBucketRepository.findAll();
        assertThat(productBucketList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllProductBuckets() throws Exception {
        // Initialize the database
        productBucketRepository.saveAndFlush(productBucket);

        // Get all the productBucketList
        restProductBucketMockMvc.perform(get("/api/product-buckets?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productBucket.getId().intValue())))
            .andExpect(jsonPath("$.[*].availableToSellQuantity").value(hasItem(DEFAULT_AVAILABLE_TO_SELL_QUANTITY.intValue())))
            .andExpect(jsonPath("$.[*].inChargeQuantity").value(hasItem(DEFAULT_IN_CHARGE_QUANTITY.intValue())))
            .andExpect(jsonPath("$.[*].brokenQuantity").value(hasItem(DEFAULT_BROKEN_QUANTITY.intValue())));
    }
    
    @Test
    @Transactional
    public void getProductBucket() throws Exception {
        // Initialize the database
        productBucketRepository.saveAndFlush(productBucket);

        // Get the productBucket
        restProductBucketMockMvc.perform(get("/api/product-buckets/{id}", productBucket.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productBucket.getId().intValue()))
            .andExpect(jsonPath("$.availableToSellQuantity").value(DEFAULT_AVAILABLE_TO_SELL_QUANTITY.intValue()))
            .andExpect(jsonPath("$.inChargeQuantity").value(DEFAULT_IN_CHARGE_QUANTITY.intValue()))
            .andExpect(jsonPath("$.brokenQuantity").value(DEFAULT_BROKEN_QUANTITY.intValue()));
    }
    @Test
    @Transactional
    public void getNonExistingProductBucket() throws Exception {
        // Get the productBucket
        restProductBucketMockMvc.perform(get("/api/product-buckets/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProductBucket() throws Exception {
        // Initialize the database
        productBucketRepository.saveAndFlush(productBucket);

        int databaseSizeBeforeUpdate = productBucketRepository.findAll().size();

        // Update the productBucket
        ProductBucket updatedProductBucket = productBucketRepository.findById(productBucket.getId()).get();
        // Disconnect from session so that the updates on updatedProductBucket are not directly saved in db
        em.detach(updatedProductBucket);
        updatedProductBucket
            .availableToSellQuantity(UPDATED_AVAILABLE_TO_SELL_QUANTITY)
            .inChargeQuantity(UPDATED_IN_CHARGE_QUANTITY)
            .brokenQuantity(UPDATED_BROKEN_QUANTITY);

        restProductBucketMockMvc.perform(put("/api/product-buckets")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedProductBucket)))
            .andExpect(status().isOk());

        // Validate the ProductBucket in the database
        List<ProductBucket> productBucketList = productBucketRepository.findAll();
        assertThat(productBucketList).hasSize(databaseSizeBeforeUpdate);
        ProductBucket testProductBucket = productBucketList.get(productBucketList.size() - 1);
        assertThat(testProductBucket.getAvailableToSellQuantity()).isEqualTo(UPDATED_AVAILABLE_TO_SELL_QUANTITY);
        assertThat(testProductBucket.getInChargeQuantity()).isEqualTo(UPDATED_IN_CHARGE_QUANTITY);
        assertThat(testProductBucket.getBrokenQuantity()).isEqualTo(UPDATED_BROKEN_QUANTITY);
    }

    @Test
    @Transactional
    public void updateNonExistingProductBucket() throws Exception {
        int databaseSizeBeforeUpdate = productBucketRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductBucketMockMvc.perform(put("/api/product-buckets")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productBucket)))
            .andExpect(status().isBadRequest());

        // Validate the ProductBucket in the database
        List<ProductBucket> productBucketList = productBucketRepository.findAll();
        assertThat(productBucketList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteProductBucket() throws Exception {
        // Initialize the database
        productBucketRepository.saveAndFlush(productBucket);

        int databaseSizeBeforeDelete = productBucketRepository.findAll().size();

        // Delete the productBucket
        restProductBucketMockMvc.perform(delete("/api/product-buckets/{id}", productBucket.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductBucket> productBucketList = productBucketRepository.findAll();
        assertThat(productBucketList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
