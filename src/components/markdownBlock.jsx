import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { micromark } from "micromark";
import { gfmTable, gfmTableHtml } from "micromark-extension-gfm-table";
import "./loading.css";
import { v1 as uuidv1 } from "uuid";

function MarkdownBlocks() {
  const [keyword, setKeyword] = useState("");
  const [markdown, setMarkdown] = useState("");
  let today = new Date();
  const [dateRange, setDateRange] = useState([
    new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
  ]);
  const [startDate, endDate] = dateRange;
  let timer = 0;

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  // Count for delay request
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Polling response from GPT's report
  async function pollingData(url) {
    console.log("in pollingData, check timer.");
    timer += 1;
    console.log("timer is ", timer);
    if (timer > 6) {
      console.log("timer > 6.");
      setMarkdown("GPT Timeout.");
    } else {
      console.log("call check API.");
      axios
        .get(url)
        .then((response) => {
          console.log("call check API done.");
          console.log("Response:", response);
          setMarkdown(response.data.result);
        })
        .catch((error) => {
          // If received 404. Retrying in 10 seconds
          if (error.response && error.response.status === 404) {
            console.log("Received 404. Retrying in 10 seconds...");
            setTimeout(() => {
              pollingData(url);
            }, 10000); // Polling data per 10 seconds
          } else {
            // Catch other error
            console.error("Error in polling:", error);
            throw error;
          }
        });
    }
  }

  function submit() {
    timer = 0;
    const uuidOfSession = uuidv1();
    console.log("Keyword is :", keyword);
    console.log("UUID is :", uuidOfSession);
    // let url = "https://potato-elfbackend.nlpnchu.org/analyze/" + keyword + "?uuidOfSession=" + uuidOfSession + "&tag=%E6%96%B0%E8%81%9E&K=5&size=10000&start=" + startDate.getTime().toString().slice(0, -3) + "&end=" + endDate.getTime().toString().slice(0, -3)
    let url =
      "http://127.0.0.1:8000/analyze/" +
      keyword +
      "?uuidOfSession=" +
      uuidOfSession +
      "&tag=%E6%96%B0%E8%81%9E&K=5&size=10000&start=" +
      startDate.getTime().toString().slice(0, -3) +
      "&end=" +
      endDate.getTime().toString().slice(0, -3);
    setMarkdown("loading");

    if (keyword == "test_for_NCHU_NLP_LAB") {
      axios
        .post(url)
        .then((res) => {
          setMarkdown(res.data);
        })
        .catch((err) => setMarkdown("# Server Error."));
    } else {
      // Don't wait response. Use polling.
      axios
        .post(url)
        .then(() => {
          console.log("Wait for 60 seconds.");
          setTimeout(() => {
            // pollingData('https://potato-elfbackend.nlpnchu.org/check/' + uuidOfSession)
            pollingData("http://127.0.0.1:8000/results/" + uuidOfSession);
          }, 60000); // wait 60 seconds to polling
        })
        .catch((err) => console.log("error in analyze, ", err));
    }
  }

  return (
    <Stack gap={3}>
      <Stack direction="horizontal" gap={1}>
        <Form.Control
          id="keywordTextArea"
          className="me-auto"
          placeholder="Please input your keyword."
          value={keyword}
          onChange={handleInputChange}
        />
        <Button variant="secondary" onClick={submit}>
          Submit
        </Button>
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
          isClearable={true}
        />
      </Stack>

      {markdown == "loading" ? (
        <div className="loader-container">
          <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img className="YT" src="https://imgur.com/tonaxAB.png" alt="" />
            報表生成中，請稍等一至兩分鐘
            <img className="YT" src="https://imgur.com/tonaxAB.png" alt="" />
          </h3>
          <div className="loader"></div>
        </div>
      ) : (
        <Markdown
          className="my-table-class"
          remarkPlugins={[remarkGfm, gfmTable]}
          rehypePlugins={[rehypeRaw]}
        >
          {markdown}
        </Markdown>
      )}
    </Stack>
  );
}

export default MarkdownBlocks;
