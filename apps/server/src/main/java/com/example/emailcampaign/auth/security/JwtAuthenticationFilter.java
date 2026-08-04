package com.example.emailcampaign.auth.security;

import com.example.emailcampaign.auth.domain.User;
import com.example.emailcampaign.auth.repository.UserRepository;
import com.example.emailcampaign.common.context.WorkspaceContext;
import com.example.emailcampaign.workspace.domain.WorkspaceMember;
import com.example.emailcampaign.workspace.repository.WorkspaceMemberRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                UUID userId = tokenProvider.getUserIdFromToken(jwt);

                User user = userRepository.findById(userId).orElse(null);
                if (user != null) {
                    UserPrincipal principal = new UserPrincipal(user);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            principal, null, principal.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    // Set WorkspaceContext seam
                    String headerWorkspaceId = request.getHeader("X-Workspace-Id");
                    if (StringUtils.hasText(headerWorkspaceId)) {
                        try {
                            UUID wsId = UUID.fromString(headerWorkspaceId);
                            if (workspaceMemberRepository.existsByWorkspaceIdAndUserId(wsId, userId)) {
                                WorkspaceContext.setCurrentWorkspaceId(wsId);
                            }
                        } catch (IllegalArgumentException ignored) {
                        }
                    } else {
                        List<WorkspaceMember> members = workspaceMemberRepository.findByUserId(userId);
                        if (!members.isEmpty()) {
                            WorkspaceContext.setCurrentWorkspaceId(members.get(0).getWorkspaceId());
                        }
                    }
                }
            }
        } catch (Exception ex) {
            log.error("Could not set user authentication in security context", ex);
        } finally {
            try {
                filterChain.doFilter(request, response);
            } finally {
                WorkspaceContext.clear();
            }
        }
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
