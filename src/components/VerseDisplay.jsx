import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const VerseDisplay = () => {
  const [verse, setVerse] = useState("Loading...");

  useEffect(() => {
    const fetchVerse = async () => {
      const { data, error } = await supabase
        .from("verses")
        .select("verse")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.log("Error fetching verse:", error);
        setVerse("Error fetching verse");
      } else if (data.length > 0) {
        setVerse(data[0].verse);
      } else {
        setVerse("No verse available");
      }
    };

    fetchVerse();

    const channel = supabase.channel("verses_changes");

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "verses" },
        (payload) => {
          setVerse(payload.new.verse);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return <div className="text-wrap">{verse}</div>;
};

export default VerseDisplay;
