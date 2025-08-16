package com.platform.codingplatform.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 10000)
    private String description;

    private String difficulty; // EASY, MEDIUM, HARD

    private String tags; // comma-separated: "array,sorting,dp"

//    @ElementCollection
//    @CollectionTable(name = "problem_testcases", joinColumns = @JoinColumn(name = "problem_id"))
//    private List<String> testCases; // Can store inputs and outputs in a specific format

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "problem_id")
    private List<TestCase> testCases;
}
