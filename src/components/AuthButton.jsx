import { useState, useEffect } from "react";

import {
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Modal,
  Tabs,
  Tab,
  Input,
  Textarea,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import { supabase } from "../utils/supabaseClient";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

const AuthButton = () => {
  const [user, setUser] = useState(null);
  const [verse, setVerse] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isEditVerseOpen,
    onOpen: onEditVerseOpen,
    onOpenChange: onEditVerseOpenChange,
  } = useDisclosure();

  const [verses, setVerses] = useState({
    verse_en: "",
    reference_en: "",
    verse_ru: "",
    reference_ru: "",
    verse_ka: "",
    reference_ka: "",
  });

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSubmitAddVerse = async (e) => {
    e.preventDefault();

    if (!user || user.email !== ADMIN_EMAIL) {
      alert("You must be logged in as an administrator to update the verse");
      return;
    }

    const { error } = await supabase.from("verses").insert({
      ...verses,
      date: new Date().toISOString().split("T")[0],
    });

    if (error) console.log("Error updating verse:", error);
    else {
      setVerses({
        verse_en: "",
        reference_en: "",
        verse_ru: "",
        reference_ru: "",
        verse_ka: "",
        reference_ka: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) alert("Error signing up: " + error.message);
      else alert("Check your email for the confirmation link");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert("Error signing in: " + error.message);
    }
  };

  const handleVerseChange = (lang, field, value) => {
    setVerses((prev) => ({
      ...prev,
      [`${field}_${lang}`]: value,
    }));
  };

  return user ? (
    <div className="text-center text-indigo-300">
      <p>Logged in as {user.email}</p>
      <div className="flex gap-3 mt-5">
        <Button
          onClick={onEditVerseOpen}
          className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-indigo-100 shadow-lg"
        >
          Add new Verse
        </Button>
        <Button
          onClick={handleLogout}
          variant="light"
          className="text-orange-600 bg-orange-900/30 hover:!bg-orange-900/60 hover:text-rose-600"
        >
          Logout
        </Button>
      </div>

      <Modal
        isOpen={isEditVerseOpen}
        onOpenChange={onEditVerseOpenChange}
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
        }}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmitAddVerse}>
              <ModalHeader className="flex flex-col gap-1">
                Add new Verse
              </ModalHeader>
              <ModalBody>
                {user && user.email === ADMIN_EMAIL ? (
                  <Tabs
                    classNames={{
                      base: "w-full",
                      tabList: "w-full",
                    }}
                  >
                    <Tab key="english" title="English">
                      <Textarea
                        label="Verse (English)"
                        value={verses.verse_en}
                        onChange={(e) =>
                          handleVerseChange("en", "verse", e.target.value)
                        }
                        minRows={8}
                        className="mb-4"
                      />
                      <Input
                        label="Reference (English)"
                        value={verses.reference_en}
                        onChange={(e) =>
                          handleVerseChange("en", "reference", e.target.value)
                        }
                      />
                    </Tab>
                    <Tab key="russian" title="Русский">
                      <Textarea
                        label="Стих (Русский)"
                        value={verses.verse_ru}
                        onChange={(e) =>
                          handleVerseChange("ru", "verse", e.target.value)
                        }
                        minRows={8}
                        className="mb-4"
                      />
                      <Input
                        label="Ссылка (Русский)"
                        value={verses.reference_ru}
                        onChange={(e) =>
                          handleVerseChange("ru", "reference", e.target.value)
                        }
                      />
                    </Tab>
                    <Tab key="georgian" title="ქართული">
                      <Textarea
                        label="ლექსი (ქართული)"
                        value={verses.verse_ka}
                        onChange={(e) =>
                          handleVerseChange("ka", "verse", e.target.value)
                        }
                        minRows={8}
                        className="mb-4"
                      />
                      <Input
                        label="მითითება (ქართული)"
                        value={verses.reference_ka}
                        onChange={(e) =>
                          handleVerseChange("ka", "reference", e.target.value)
                        }
                      />
                    </Tab>
                  </Tabs>
                ) : (
                  <p>
                    You must be logged in as an administrator to edit the verse
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  type="submit"
                  onPress={onClose}
                  className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                >
                  Add Verse
                </Button>
                <Button
                  onPress={onClose}
                  variant="light"
                  className="text-orange-600 hover:!bg-orange-900/50"
                >
                  Close
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  ) : (
    <>
      <Button
        variant="light"
        onPress={onOpen}
        className="text-indigo-800 hover:text-orange-500 hover:!bg-indigo-500/30"
      >
        Sign In
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
        }}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">Sign In</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-5">
                  <Input
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isRequired
                    classNames={{
                      inputWrapper: "bg-gray-300",
                    }}
                  />

                  <Input
                    type="password"
                    label="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isRequired
                    classNames={{
                      inputWrapper: "bg-gray-300",
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  type="submit"
                  onPress={onClose}
                  className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                >
                  Sign In
                </Button>
                <Button
                  onPress={onClose}
                  variant="light"
                  className="text-orange-600 hover:!bg-orange-900/50"
                >
                  Close
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthButton;
