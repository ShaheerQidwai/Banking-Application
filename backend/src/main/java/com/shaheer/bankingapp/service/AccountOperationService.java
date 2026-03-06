package com.shaheer.bankingapp.service;

import com.shaheer.bankingapp.dto.BalanceResponse;
import com.shaheer.bankingapp.dto.TransactionResponse;
import com.shaheer.bankingapp.exception.AccountNotFoundException;
import com.shaheer.bankingapp.exception.InactiveAccountException;
import com.shaheer.bankingapp.exception.InsufficientBalanceException;
import com.shaheer.bankingapp.exception.InvalidTransactionException;
import com.shaheer.bankingapp.model.Account;
import com.shaheer.bankingapp.model.TransactionType;
import com.shaheer.bankingapp.repository.AccountRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class AccountOperationService {

    private final AccountRepository accountRepository;
    private final TransactionService transactionService;

    @Transactional
    public BalanceResponse deposit(String accountNumber, BigDecimal amount) {
        validatePositiveAmount(amount);
        Account account = getActiveAccount(accountNumber);

        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);
        transactionService.recordDeposit(account, amount);

        return new BalanceResponse(account.getAccountNumber(), account.getBalance());
    }

    @Transactional
    public BalanceResponse withdraw(String accountNumber, BigDecimal amount) {
        validatePositiveAmount(amount);
        Account account = getActiveAccount(accountNumber);

        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(accountNumber);
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);
        transactionService.recordWithdrawal(account, amount);

        return new BalanceResponse(account.getAccountNumber(), account.getBalance());
    }

    @Transactional
    public BalanceResponse transfer(String fromAccountNumber, String toAccountNumber, BigDecimal amount) {
        validatePositiveAmount(amount);

        if (fromAccountNumber.equals(toAccountNumber)) {
            throw new InvalidTransactionException("Source and destination accounts must be different");
        }

        Account fromAccount = getActiveAccount(fromAccountNumber);
        Account toAccount = getActiveAccount(toAccountNumber);

        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(fromAccountNumber);
        }

        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        toAccount.setBalance(toAccount.getBalance().add(amount));

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
        transactionService.recordTransfer(fromAccount, toAccount, amount);

        return new BalanceResponse(fromAccount.getAccountNumber(), fromAccount.getBalance());
    }

    @Transactional(readOnly = true)
    public BalanceResponse getBalance(String accountNumber) {
        Account account = getActiveAccount(accountNumber);
        return new BalanceResponse(account.getAccountNumber(), account.getBalance());
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getTransactionHistory(
            String accountNumber,
            TransactionType type,
            LocalDateTime from,
            LocalDateTime to,
            int page,
            int size) {
        getActiveAccount(accountNumber);
        return transactionService.getTransactionsForAccount(accountNumber, type, from, to, page, size);
    }

    private Account getActiveAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));

        if (!account.isActive()) {
            throw new InactiveAccountException(accountNumber);
        }
        return account;
    }

    private void validatePositiveAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Amount must be greater than zero");
        }
    }
}
