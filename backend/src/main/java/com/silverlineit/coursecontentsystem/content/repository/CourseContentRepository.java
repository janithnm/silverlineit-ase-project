package com.silverlineit.coursecontentsystem.content.repository;

import com.silverlineit.coursecontentsystem.content.entity.CourseContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseContentRepository extends JpaRepository<CourseContent, Long> {

    Page<CourseContent> findByDeletedFalse(Pageable pageable);

    Page<CourseContent> findByDeletedFalseAndFileType(
            CourseContent.FileType fileType, Pageable pageable);

    Page<CourseContent> findByUploaderIdAndDeletedFalse(
            Long uploaderId, Pageable pageable);

    Optional<CourseContent> findByIdAndDeletedFalse(Long id);
}