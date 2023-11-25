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
import { micromark } from 'micromark'
import { gfmTable, gfmTableHtml } from 'micromark-extension-gfm-table'
import "./loading.css";
import { v1 as uuidv1 } from 'uuid';

function MarkdownBlocks() {
  const [keyword, setKeyword] = useState("");
  const [markdown, setMarkdown] = useState("");
  let today = new Date();
  const [dateRange, setDateRange] = useState([new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)]);
  const [startDate, endDate] = dateRange;
  let timer = 0;

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  // Count for delay request
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Polling response from GPT's report
  async function pollingData(url) {
    timer += 1
    if (timer == 1) {
      await delay(60000); // 60000
      console.log("waiting done.")
    }
    console.log("in pollingData, check timer.")
    console.log("timer is ", timer)
    if (timer > 2) {
      return
    } else {
      try {
        console.log("call check.")
        const response = await axios.get(url);
        console.log('Response:', response.status, response.data);
        return response;
      } catch (error) {
        // If received 404. Retrying in 10 seconds
        if (error.response && error.response.status === 404) {
          console.log('Received 404. Retrying in 10 seconds...');
          await delay(10000); // 10000
          return pollingData(url);
        } else {
          // Catch other error
          console.error('Error:', error);
          setMarkdown("# 發生錯誤")
          throw error;
        }
      }
    }
  }


  function submit() {
    const uuidOfSession = uuidv1();
    console.log("Keyword is :", keyword);
    console.log("UUID is :", uuidOfSession);
    // let url = "https://potato-elfbackend.nlpnchu.org/analyze/" + keyword + "?uuidOfSession=" + uuidOfSession + "&tag=%E6%96%B0%E8%81%9E&K=5&size=10000&start=" + startDate.getTime().toString().slice(0, -3) + "&end=" + endDate.getTime().toString().slice(0, -3)
    let url = "https://potato-elfbackend.nlpnchu.org/analyze/" + keyword + "?uuidOfSession=" + uuidOfSession + "&tag=%E6%96%B0%E8%81%9E&K=5&size=10000&start=" + startDate.getTime().toString().slice(0, -3) + "&end=" + endDate.getTime().toString().slice(0, -3)
    setMarkdown("loading");

    if (keyword == "test_for_NCHU_NLP_LAB") {
      axios.post(url)
        .then((res) => {
          setMarkdown(res.data);
        })
        .catch(err => setMarkdown("# Server Error."))
    } else {
      // Don't wait response. Use polling.
      axios.post(url)
        .then((res) => {
          setMarkdown(res.data);
        })
        .catch(err => setMarkdown("# Server Error."))
      console.log("Wait for 10 seconds.")
      // setTimeout(() => {
      //   // pollingData('https://potato-elfbackend.nlpnchu.org/check/' + uuidOfSession)
      //   pollingData('http://127.0.0.1:8000/check/' + uuidOfSession)
      //     .then(result => {
      //       console.log("Get response by ", uuidOfSession);
      //       setMarkdown(result.data);
      //     })
      //     .catch(err => {
      //       console.log("error: ", err);
      //       if (timer > 2) {
      //         setMarkdown("# GPT Timeout.");
      //       } else {
      //         if(err.response.status === 524){
      //           setMarkdown("# 524")
      //         }
      //       }
      //     });
      // }, 10000);
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

          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}><img className="YT" src="https://imgur.com/tonaxAB.png" alt="" />報表生成中，請稍等一至兩分鐘<img className="YT" src="https://imgur.com/tonaxAB.png" alt="" /></h3>
          <div className="loader"><img className="YTimg" src="https://imgur.com/tonaxAB.png" alt="" /></div>
        </div>
      ) : (
        <Markdown className="my-table-class" remarkPlugins={[remarkGfm, gfmTable]} rehypePlugins={[rehypeRaw]}>
          {markdown}
        </Markdown>
      )}
    </Stack>
  );
}

export default MarkdownBlocks;
