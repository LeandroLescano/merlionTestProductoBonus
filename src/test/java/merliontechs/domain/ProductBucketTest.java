package merliontechs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import merliontechs.web.rest.TestUtil;

public class ProductBucketTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductBucket.class);
        ProductBucket productBucket1 = new ProductBucket();
        productBucket1.setId(1L);
        ProductBucket productBucket2 = new ProductBucket();
        productBucket2.setId(productBucket1.getId());
        assertThat(productBucket1).isEqualTo(productBucket2);
        productBucket2.setId(2L);
        assertThat(productBucket1).isNotEqualTo(productBucket2);
        productBucket1.setId(null);
        assertThat(productBucket1).isNotEqualTo(productBucket2);
    }
}
