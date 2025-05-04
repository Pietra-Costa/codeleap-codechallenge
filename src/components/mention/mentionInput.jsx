import React, { useEffect, useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
import { getDatabase, ref, onValue } from "firebase/database";
import mentionStyle from "./mentionStyle";

const MentionInput = ({ value, onChange, onKeyDown, disabled }) => {
  const [mentionUsers, setMentionUsers] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    onValue(usersRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.entries(data).map(([uid, user]) => ({
          id: uid,
          display: user.displayName || user.email,
        }));
        setMentionUsers(formatted);
      }
    });
  }, []);

  return (
    <MentionsInput
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      style={mentionStyle}
      className="mention-input w-full min-h-[100px] p-3 border border-primary/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
      disabled={disabled}
      placeholder="Escreva um comentário..."
      highlighter="blue"
    >
      <Mention
        trigger="@"
        data={mentionUsers}
        markup="@__display__"
        appendSpaceOnAdd={true}
        displayTransform={(id, display) => `@${display}`}
        style={{
          backgroundColor: "transparent",
          padding: "0",
        }}
      />
    </MentionsInput>
  );
};

export default MentionInput;
