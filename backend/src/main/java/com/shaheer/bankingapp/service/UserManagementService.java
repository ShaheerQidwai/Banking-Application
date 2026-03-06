package com.shaheer.bankingapp.service;

import com.shaheer.bankingapp.dto.AccountResponse;
import com.shaheer.bankingapp.dto.CreateAccountRequest;
import com.shaheer.bankingapp.dto.LoginRequest;
import com.shaheer.bankingapp.dto.LoginResponse;
import com.shaheer.bankingapp.exception.AccountNotFoundException;
import com.shaheer.bankingapp.exception.AuthenticationFailedException;
import com.shaheer.bankingapp.exception.DuplicateUserException;
import com.shaheer.bankingapp.model.Account;
import com.shaheer.bankingapp.model.User;
import com.shaheer.bankingapp.repository.AccountRepository;
import com.shaheer.bankingapp.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
@AllArgsConstructor
public class UserManagementService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {
        if (userRepository.existsByCnic(request.getCnic())) {
            throw new DuplicateUserException(request.getCnic());
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setCnic(request.getCnic());
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword());
        User savedUser = userRepository.save(user);

        Account account = new Account();
        account.setUser(savedUser);
        account.setAccountType(request.getAccountType());
        account.setBalance(request.getInitialBalance());
        account.setAccountNumber(generateUniqueAccountNumber());

        Account savedAccount = accountRepository.save(account);
        return toAccountResponse(savedAccount);
    }

    @Transactional(readOnly = true)
    public AccountResponse getAccountByNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));
        return toAccountResponse(account);
    }

    @Transactional
    public void deleteAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));
        account.setActive(false);
        accountRepository.save(account);
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByCnic(request.getCnic())
                .orElseThrow(AuthenticationFailedException::new);

        if (!user.getPassword().equals(request.getPassword())) {
            throw new AuthenticationFailedException();
        }

        return new LoginResponse(user.getId(), user.getFullName(), "Login successful");
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            long randomNumber = 1000000000L + Math.abs(SECURE_RANDOM.nextLong() % 9000000000L);
            accountNumber = "AC" + randomNumber;
        } while (accountRepository.existsByAccountNumber(accountNumber));

        return accountNumber;
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
