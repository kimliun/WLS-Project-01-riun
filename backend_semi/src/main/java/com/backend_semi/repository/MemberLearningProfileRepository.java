package com.backend_semi.repository;

import com.backend_semi.learningprofile.MemberLearningProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberLearningProfileRepository extends JpaRepository<MemberLearningProfile, Long> {
}
