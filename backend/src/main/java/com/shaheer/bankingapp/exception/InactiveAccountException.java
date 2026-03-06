package com.shaheer.bankingapp.exception;

public class InactiveAccountException extends BankingException {
    public InactiveAccountException(String accountNumber) {
        super("Account is inactive: " + accountNumber);
    }
}
