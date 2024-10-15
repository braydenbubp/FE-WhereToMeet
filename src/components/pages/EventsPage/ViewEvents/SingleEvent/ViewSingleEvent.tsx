import { getSingleEvent } from "@/api/events";
import styles from "../EventStyles.module.css"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Event } from "dataTypes";
import SuggestionsContainer from "../SuggestionsContainer";
import SuggestionForm from "./SuggestionForm";

export default function ViewSingleEvent() {
  const [singleEvent, setSingleEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { eventId } = useParams();


  useEffect(() => {
    if (eventId) {
      setIsLoading(true);
      setError(null);
      getSingleEvent(eventId)
        .then((event) => {
          //@ts-ignore
          setSingleEvent(event);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching event:", err);
          setError("Failed to fetch event details");
          setIsLoading(false);
        });
    }
  }, [eventId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!singleEvent) return <div>No event found</div>;

  if (isLoading) {
    return "";
  }

  return (
    <div className={styles.eventContainer}>

      {/* ---Event Name----*/}
      <div>
        <h2 >{singleEvent?.name}</h2>

        {/* ---Description----*/}
        <p style={{ marginTop: '2em' }}>
          {singleEvent?.description}
        </p>
        <p>{singleEvent?.time}</p>
      </div>

      <div style={{ marginTop: '3em' }}>
        {/* ----Add A Suggestion Button---- */}
        <SuggestionForm event={singleEvent} />

        {/* ----Suggestions Container---- */}
        <SuggestionsContainer event={singleEvent} />
      </div>

    </div>
  );
}