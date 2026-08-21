package com.example.emailcampaign.billing.repository;

import com.example.emailcampaign.billing.domain.CreditPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CreditPurchaseRepository extends JpaRepository<CreditPurchase, UUID> {

    Optional<CreditPurchase> findByDodoSessionId(String dodoSessionId);

    Optional<CreditPurchase> findByDodoPaymentId(String dodoPaymentId);
}
