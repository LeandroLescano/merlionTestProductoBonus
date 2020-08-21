package merliontechs.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * A ProductBucket.
 */
@Entity
@Table(name = "product_bucket")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProductBucket implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @DecimalMax(value = "10")
    @Column(name = "available_to_sell_quantity", precision = 21, scale = 2)
    private BigDecimal availableToSellQuantity;

    @DecimalMax(value = "3")
    @Column(name = "in_charge_quantity", precision = 21, scale = 2)
    private BigDecimal inChargeQuantity;

    @DecimalMax(value = "2")
    @Column(name = "broken_quantity", precision = 21, scale = 2)
    private BigDecimal brokenQuantity;

    @OneToOne
    @JoinColumn(unique = true)
    private Product product;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAvailableToSellQuantity() {
        return availableToSellQuantity;
    }

    public ProductBucket availableToSellQuantity(BigDecimal availableToSellQuantity) {
        this.availableToSellQuantity = availableToSellQuantity;
        return this;
    }

    public void setAvailableToSellQuantity(BigDecimal availableToSellQuantity) {
        this.availableToSellQuantity = availableToSellQuantity;
    }

    public BigDecimal getInChargeQuantity() {
        return inChargeQuantity;
    }

    public ProductBucket inChargeQuantity(BigDecimal inChargeQuantity) {
        this.inChargeQuantity = inChargeQuantity;
        return this;
    }

    public void setInChargeQuantity(BigDecimal inChargeQuantity) {
        this.inChargeQuantity = inChargeQuantity;
    }

    public BigDecimal getBrokenQuantity() {
        return brokenQuantity;
    }

    public ProductBucket brokenQuantity(BigDecimal brokenQuantity) {
        this.brokenQuantity = brokenQuantity;
        return this;
    }

    public void setBrokenQuantity(BigDecimal brokenQuantity) {
        this.brokenQuantity = brokenQuantity;
    }

    public Product getProduct() {
        return product;
    }

    public ProductBucket product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductBucket)) {
            return false;
        }
        return id != null && id.equals(((ProductBucket) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductBucket{" +
            "id=" + getId() +
            ", availableToSellQuantity=" + getAvailableToSellQuantity() +
            ", inChargeQuantity=" + getInChargeQuantity() +
            ", brokenQuantity=" + getBrokenQuantity() +
            "}";
    }
}
