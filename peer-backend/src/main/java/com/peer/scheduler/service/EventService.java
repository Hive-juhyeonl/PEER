package com.peer.scheduler.service;

import com.peer.common.exception.CustomException;
import com.peer.common.exception.ErrorCode;
import com.peer.scheduler.dto.EventRequest;
import com.peer.scheduler.dto.EventResponse;
import com.peer.scheduler.entity.Event;
import com.peer.scheduler.repository.EventRepository;
import com.peer.user.entity.User;
import com.peer.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public List<EventResponse> getEvents(Long userId, LocalDateTime start, LocalDateTime end) {
        return eventRepository.findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(userId, start, end)
                .stream()
                .map(EventResponse::from)
                .toList();
    }

    public EventResponse getEvent(Long eventId, Long userId) {
        Event event = eventRepository.findByIdAndUserId(eventId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));
        return EventResponse.from(event);
    }

    @Transactional
    public EventResponse createEvent(EventRequest request, Long userId) {
        validateEventTime(request.getStartTime(), request.getEndTime());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Event event = Event.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .allDay(request.isAllDay())
                .color(request.getColor())
                .repeatRule(request.getRepeatRule())
                .build();

        return EventResponse.from(eventRepository.save(event));
    }

    @Transactional
    public EventResponse updateEvent(Long eventId, EventRequest request, Long userId) {
        validateEventTime(request.getStartTime(), request.getEndTime());

        Event event = eventRepository.findByIdAndUserId(eventId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));

        event.update(
                request.getTitle(),
                request.getDescription(),
                request.getStartTime(),
                request.getEndTime(),
                request.isAllDay(),
                request.getColor(),
                request.getRepeatRule()
        );

        return EventResponse.from(event);
    }

    @Transactional
    public void deleteEvent(Long eventId, Long userId) {
        Event event = eventRepository.findByIdAndUserId(eventId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));
        eventRepository.delete(event);
    }

    private void validateEventTime(LocalDateTime startTime, LocalDateTime endTime) {
        if (endTime.isBefore(startTime)) {
            throw new CustomException(ErrorCode.INVALID_EVENT_TIME);
        }
    }
}
