package com.backend_semi.service;

import com.backend_semi.constant.Role;
import com.backend_semi.dto.MemberSignupRequest;
import com.backend_semi.learningprofile.LearningProfile;
import com.backend_semi.learningprofile.MemberLearningProfile;
import com.backend_semi.member.Member;
import com.backend_semi.repository.LearningProfileRepository;
import com.backend_semi.repository.MemberLearningProfileRepository;
import com.backend_semi.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final LearningProfileRepository learningProfileRepository;
    private final MemberLearningProfileRepository memberLearningProfileRepository;

    @Transactional
    public Long signup(MemberSignupRequest request){
        // 1.아이디 중복 확인
        if(memberRepository.existsByLoginId(request.getLoginId())){
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // 2. 이메일 중복 확인
        if(memberRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 3. Member 객체 생성
        Member member = new Member(
                Role.USER,
                request.getName(),
                request.getLoginId(),
                request.getPassword(),
                request.getEmail(),
                request.getPhone(),
                request.getBirthDate()
        );

        // 4. members 테이블에 저장

        Member savedMember = memberRepository.save(member);

        // 5. 선택한 관심학습분야 저장
        if(request.getProfileIds() != null){
            for(Long profileId : request.getProfileIds()){
                LearningProfile learningProfile = learningProfileRepository.findById(profileId)
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 학습 프로필입니다."));

                MemberLearningProfile memberLearningProfile = new MemberLearningProfile(savedMember, learningProfile);

                memberLearningProfileRepository.save(memberLearningProfile);
            }
        }

        return savedMember.getMemberId();

    }
}
