package com.shaheer.bankingapp.exception;

public class InsufficientBalanceException extends BankingException {
    public InsufficientBalanceException(String accountNumber) {
        super("Insufficient balance in account: " + accountNumber);
    }
}
