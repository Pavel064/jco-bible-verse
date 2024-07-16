import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Tabs, Tab } from "@nextui-org/react";

const VerseDisplay = () => {
  const [verses, setVerses] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerses = async () => {
      const { data, error } = await supabase
        .from("verses")
        .select(
          "verse_en, reference_en, verse_ru, reference_ru, verse_ka, reference_ka"
        )
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.log("Error fetching verses:", error);
        setError("Error fetching verses");
      } else if (data.length > 0) {
        setVerses(data[0]);
      } else {
        setError("No verses available");
      }
    };

    fetchVerses();

    const channel = supabase.channel("verses_changes");

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "verses" },
        (payload) => {
          setVerses(payload.new);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <>
      {error ? (
        <p>{error}</p>
      ) : (
        <Tabs
          placement="bottom"
          radius="lg"
          defaultSelectedKey="2"
          variant="light"
          classNames={{
            base: "self-center mt-5 md:mt-10",
            tabList: "md:w-96",
            panel:
              "text-justify md:text-center text-wrap min-h-[450px] md:min-h-52",
            tab: "py-5",
            tabContent:
              "text-indigo-200 group-data-[selected=true]:text-indigo-100",
            cursor: "bg-gradient-to-tr from-pink-500 to-yellow-500 shadow-lg",
          }}
        >
          <Tab title="ქართული" key="1">
            <div>
              <p className="mb-2">{verses.verse_ka}</p>
              <p className="text-sm opacity-70">{verses.reference_ka}</p>
            </div>
          </Tab>
          <Tab title="English" key="2">
            <div>
              <p className="mb-2">{verses.verse_en}</p>
              <p className="text-sm opacity-70">{verses.reference_en}</p>
            </div>
          </Tab>
          <Tab title="Русский" key="3">
            <div>
              <p className="mb-2">{verses.verse_ru}</p>
              <p className="text-sm opacity-70">{verses.reference_ru}</p>
            </div>
          </Tab>
        </Tabs>
      )}
    </>
  );
};

export default VerseDisplay;
