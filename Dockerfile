FROM docker.io/httpd:2.4-alpine

# 1. 아파치 기본 설정을 오픈시프트 환경에 맞게 수정
# - Listen 포트를 8080으로 변경
# - PID 파일 위치를 권한이 자유로운 /tmp로 이동 (핵심 해결책)
# - 로그를 파일이 아닌 표준 출력(stdout/stderr)으로 리다이렉트
RUN sed -i 's/Listen 80/Listen 8080/' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's#^PidFile .*#PidFile "/tmp/httpd.pid"#' /usr/local/apache2/conf/httpd.conf || echo 'PidFile "/tmp/httpd.pid"' >> /usr/local/apache2/conf/httpd.conf && \
    sed -i 's#CustomLog "logs/access_log"#CustomLog /proc/self/fd/1#' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's#ErrorLog "logs/error_log"#ErrorLog /proc/self/fd/2#' /usr/local/apache2/conf/httpd.conf

# 2. 정적 파일 복사
COPY ./ /usr/local/apache2/htdocs/

# 3. 오픈시프트 권한 규정 준수 (GID 0 권한 부여)
RUN chgrp -R 0 /usr/local/apache2/htdocs /usr/local/apache2/logs /usr/local/apache2/conf && \
    chmod -R g=u /usr/local/apache2/htdocs /usr/local/apache2/logs /usr/local/apache2/conf

EXPOSE 8080