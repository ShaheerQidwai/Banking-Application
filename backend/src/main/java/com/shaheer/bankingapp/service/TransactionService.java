package com.shaheer.bankingapp.service;

import com.shaheer.bankingapp.dto.TransactionResponse;
import com.shaheer.bankingapp.model.Account;
import com.shaheer.bankingapp.model.Transaction;
import com.shaheer.bankingapp.model.TransactionType;
import com.shaheer.bankingapp.repository.TransactionRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    @Transactional
    public Transaction recordDeposit(Account toAccount, BigDecimal amount) {
        return saveTransaction(TransactionType.DEPOSIT, amount, null, toAccount, "Deposit to account");
    }

    @Transactional
    public Transaction recordWithdrawal(Account fromAccount, BigDecimal amount) {
        return saveTransaction(TransactionType.WITHDRAW, amount, fromAccount, null, "Withdrawal from account");
    }

    @Transactional
    public Transaction recordTransfer(Account fromAccount, Account toAccount, BigDecimal amount) {
        return saveTransaction(TransactionType.TRANSFER, amount, fromAccount, toAccount, "Transfer between accounts");
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getTransactionsForAccount(
            String accountNumber,
            TransactionType type,
            LocalDateTime from,
            LocalDateTime to,
            int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return transactionRepository
                .findTransactionsForAccount(accountNumber, type, from, to, pageable)
                .map(this::toTransactionResponse);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getAllTransactions(
            TransactionType type,
            LocalDateTime from,
            LocalDateTime to,
            int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Specification<Transaction> spec = buildTransactionSpecification(type, from, to);
        return transactionRepository.findAll(spec, pageable).map(this::toTransactionResponse);
    }

    private Specification<Transaction> buildTransactionSpecification(
            TransactionType type,
            LocalDateTime from,
            LocalDateTime to) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (type != null) {
                predicates.add(criteriaBuilder.equal(root.get("type"), type));
            }
            if (from != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), from));
            }
            if (to != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), to));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Transaction saveTransaction(TransactionType type, BigDecimal amount, Account fromAccount, Account toAccount,
            String description) {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(generateTransactionId());
        transaction.setType(type);
        transaction.setAmount(amount);
        transaction.setFromAccount(fromAccount);
        transaction.setToAccount(toAccount);
        transaction.setDescription(description);
        return transactionRepository.save(transaction);
    }

    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }

    private TransactionResponse toTransactionResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getTransactionId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getCreatedAt(),
                transaction.getFromAccount() != null ? transaction.getFromAccount().getAccountNumber() : null,
                transaction.getToAccount() != null ? transaction.getToAccount().getAccountNumber() : null,
                transaction.getDescription());
    }
}
