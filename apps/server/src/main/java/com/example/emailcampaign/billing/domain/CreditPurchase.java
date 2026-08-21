package com.example.emailcampaign.billing.domain;

import com.example.emailcampaign.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "credit_purchases")
public class CreditPurchase extends BaseEntity {

    @Column(nullable = false)
    private UUID workspaceId;

    @Column(nullable = false)
    private String packId;

    @Column(nullable = false)
    private long credits;

    @Column(nullable = false)
    private long amountCents;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CreditPurchaseStatus status = CreditPurchaseStatus.PENDING;

    /** Dodo checkout session id, known at creation time. */
    @Column(nullable = false)
    private String dodoSessionId;

    /** Dodo payment id, only known once the webhook reports payment.succeeded/failed. Unique guard against double-processing. */
    @Column(unique = true)
    private String dodoPaymentId;
}
