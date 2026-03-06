package com.shaheer.bankingapp.exception;

public class DuplicateUserException extends BankingException {
    public DuplicateUserException(String cnic) {
        super("User already exists with CNIC: " + cnic);
    }
}
