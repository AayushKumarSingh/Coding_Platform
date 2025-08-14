package com.platform.codingplatform.model;

import jakarta.persistence.*;

@Entity
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String input;
    private String expectedOutput;

    @ManyToOne
    @JoinColumn(name = "Problem_id")
    private Problem problem;

    public String getExpectedOutput(){
        return expectedOutput;
    }

    public String getInput(){
        return input;
    }
}
