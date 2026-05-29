package com.backend_semi.controller;

import com.backend_semi.dto.MemberSignupRequest;
import com.backend_semi.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<Long> signup(@RequestBody MemberSignupRequest request){
        Long memberId = memberService.signup(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(memberId);
    }
}
