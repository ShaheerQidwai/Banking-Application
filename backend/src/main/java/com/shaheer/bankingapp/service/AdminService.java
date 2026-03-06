package com.shaheer.bankingapp.service;

import com.shaheer.bankingapp.dto.AccountResponse;
import com.shaheer.bankingapp.dto.AdminTotalBalanceResponse;
import com.shaheer.bankingapp.dto.TransactionResponse;
import com.shaheer.bankingapp.model.Account;
import com.shaheer.bankingapp.model.TransactionType;
import com.shaheer.bankingapp.repository.AccountRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class AdminService {

    private final AccountRepository accountRepository;
    private final TransactionService transactionService;

    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream().map(this::toAccountResponse).toList();
    }

    @Transactional(readOnly = true)
    public AdminTotalBalanceResponse getTotalBankBalance() {
        BigDecimal total = accountRepository.getTotalBalanceForActiveAccounts();
        return new AdminTotalBalanceResponse(total);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getAllTransactions(
            TransactionType type,
            LocalDateTime from,
            LocalDateTime to,
            int page,
            int size) {
        return transactionService.getAllTransactions(type, from, to, page, size);
    }

    private AccountResponse toAccountResponse(Account account) {
        return new AccountResponse(
                account.getAccountNumber(),
                account.getUser().getFullName(),
                account.getUser().getCnic(),
                account.getUser().getPhone(),
                account.getAccountType(),
                account.getBalance(),
                account.isActive(),
                account.getCreatedAt());
    }
}
