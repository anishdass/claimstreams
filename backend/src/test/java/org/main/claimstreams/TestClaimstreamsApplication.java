package org.main.claimstreams;

import org.springframework.boot.SpringApplication;

public class TestClaimstreamsApplication {

	public static void main(String[] args) {
		SpringApplication.from(ClaimstreamsApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
