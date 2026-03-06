package com.shaheer.bankingapp.repository;

import com.shaheer.bankingapp.model.Transaction;
import com.shaheer.bankingapp.model.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

	@Query("""
			SELECT t FROM Transaction t
			LEFT JOIN t.fromAccount fa
			LEFT JOIN t.toAccount ta
			WHERE (fa.accountNumber = :accountNumber OR ta.accountNumber = :accountNumber)
			  AND (:type IS NULL OR t.type = :type)
			  AND (:from IS NULL OR t.createdAt >= :from)
			  AND (:to IS NULL OR t.createdAt <= :to)
			""")
	Page<Transaction> findTransactionsForAccount(
			@Param("accountNumber") String accountNumber,
			@Param("type") TransactionType type,
			@Param("from") LocalDateTime from,
			@Param("to") LocalDateTime to,
			Pageable pageable);
}
