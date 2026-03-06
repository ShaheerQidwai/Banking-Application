package com.shaheer.bankingapp.repository;

import com.shaheer.bankingapp.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountNumber(String accountNumber);

    boolean existsByAccountNumber(String accountNumber);

    Optional<Account> findByAccountNumberAndActiveTrue(String accountNumber);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(a.balance), 0) FROM Account a WHERE a.active = true")
    BigDecimal getTotalBalanceForActiveAccounts();
}
