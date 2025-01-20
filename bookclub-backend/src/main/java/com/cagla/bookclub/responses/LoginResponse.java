package com.cagla.bookclub.responses;

public class LoginResponse {

	private String token;
	private String refreshToken;
    private long expiresIn;

    public String getToken() {
        return token;
    }

	public long getExpiresIn() {
		return expiresIn;
	}
	
	public String getRefreshToken() {
		return refreshToken;
	}

	public LoginResponse setExpiresIn(long expiresIn) {
		this.expiresIn = expiresIn;
        return this;
	}

	public LoginResponse setToken(String token) {
		this.token = token;
        return this; 
	}
    
	public LoginResponse setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
		return this;
	}
    
}
