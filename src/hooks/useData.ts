import { useState, useEffect } from 'react';
import { fetchEvents, fetchClubs, fetchInternships, fetchWorkshops, fetchVolunteering } from '../lib/api';
import type { EventDto, ClubDto, InternshipDto, WorkshopDto, VolunteeringDto } from '../lib/api';

/**
 * Custom hook to fetch and manage events with auto-refresh on data changes.
 */
export function useEvents(status?: 'published' | 'draft' | 'approved' | 'rejected' | 'pending') {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEvents(status);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
    // Refetch every 10s or when status changes
    const interval = setInterval(refetch, 10000);
    return () => clearInterval(interval);
  }, [status]);

  return { events, loading, error, refetch };
}

/**
 * Custom hook to fetch and manage clubs with auto-refresh on data changes.
 */
export function useClubs() {
  const [clubs, setClubs] = useState<ClubDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchClubs();
      setClubs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clubs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
    // Refetch every 10s
    const interval = setInterval(refetch, 10000);
    return () => clearInterval(interval);
  }, []);

  return { clubs, loading, error, refetch };
}

/**
 * Custom hook to fetch and manage internships with auto-refresh on data changes.
 */
export function useInternships(status?: string) {
  const [internships, setInternships] = useState<InternshipDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInternships(status);
      setInternships(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch internships');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
    // Refetch every 10s or when status changes
    const interval = setInterval(refetch, 10000);
    return () => clearInterval(interval);
  }, [status]);

  return { internships, loading, error, refetch };
}

/**
 * Custom hook to fetch and manage workshops with auto-refresh on data changes.
 */
export function useWorkshops(status?: string) {
  const [workshops, setWorkshops] = useState<WorkshopDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWorkshops(status);
      setWorkshops(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workshops');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
    // Refetch every 10s or when status changes
    const interval = setInterval(refetch, 10000);
    return () => clearInterval(interval);
  }, [status]);

  return { workshops, loading, error, refetch };
}

/**
 * Custom hook to fetch and manage volunteering opportunities with auto-refresh on data changes.
 */
export function useVolunteering(status?: string) {
  const [volunteering, setVolunteering] = useState<VolunteeringDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchVolunteering(status);
      setVolunteering(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch volunteering opportunities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
    // Refetch every 10s or when status changes
    const interval = setInterval(refetch, 10000);
    return () => clearInterval(interval);
  }, [status]);

  return { volunteering, loading, error, refetch };
}
