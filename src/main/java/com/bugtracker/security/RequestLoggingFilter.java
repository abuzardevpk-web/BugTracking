package com.bugtracker.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String method = request.getMethod();
        String uri = request.getRequestURI();
        String authHeader = request.getHeader("Authorization");

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        log.info("Incoming request: {} {}", method, uri);
        log.info("Authorization header present: {}", authHeader != null ? "yes" : "no");
        if (authHeader != null) {
            // do not log the full token for security; log the prefix and first/last chars
            String display = authHeader.length() > 12 ? authHeader.substring(0, 12) + "..." : authHeader;
            log.info("Authorization header (truncated): {}", display);
        }

        if (auth != null) {
            log.info("SecurityContext Authentication: principal={} authenticated={} authorities={}",
                    auth.getPrincipal(), auth.isAuthenticated(), auth.getAuthorities());
        } else {
            log.info("SecurityContext Authentication: none");
        }

        filterChain.doFilter(request, response);
    }
}
