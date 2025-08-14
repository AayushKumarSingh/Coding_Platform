package com.platform.codingplatform.repository;

import com.platform.codingplatform.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
}
