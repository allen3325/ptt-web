import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import axios from "axios";
import "./loading.css";

function MarkdownBlocks() {
  const [keyword, setKeyword] = useState("");
  const [markdown, setMarkdown] = useState("");

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  function submit() {
    console.log("Keyword:", keyword);
    setMarkdown("loading");
    axios
      .get(
        "http://127.0.0.1:8000/analyze/" +
          keyword +
          "?tag=%E6%96%B0%E8%81%9E&K=5&size=10000&start=1698076800&end=1698163200"
      )
      .then((res) => {
        console.log(res.data);
        setMarkdown(res.data);
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  }
  //   const markdown = `
  // # 事件總結標題：柯文哲與侯友宜的合作問題引發網友熱議

  // | 事件觀點 | 留言對此觀點的看法 |
  // |---------|------------------|
  // | 柯文哲秉持開闊的格局，致力整合各方建議與政見，絕非國民黨口中的「串門子」，而是匯聚民間力量，達成政黨輪替的目標。 | - 連柯都要主流民意大聯盟了？ <br> - 人家都提了民調+民主初選 <br> - 柯提出來的辦法都細到連數字都有了，侯辦也沒說柯的民調方案或數字哪一塊，他們不滿要改，反觀柯對侯的民調質疑，侯辦沒一樣認真回應的 |
  // | 侯友宜願意接受「柯侯配」，但柯文哲要回覆是否同意，否則進入政黨協商。 | - 你是不是很怕柯侯配 <br> - 侯柯這兩個咖洨真的想談 早就同桌坐下來談了啦 <br> - 侯還在堅持不可行沒科學可信度的民主初選根本冥頑不靈 |
  // | 侯友宜要求柯文哲回覆是否合作，否則進入政黨協商。 | - 柯郭是最佳解，候去旁邊玩沙 <br> - 侯真的被大家看衰，沒救了 <br> - 侯真的好吠 |
  // | 侯友宜願意接受「柯侯配」，但柯文哲要回覆是否同意，否則進入政黨協商。 | - 侯的說法就像是告訴柯，你吃屎我就當副手 <br> - 在一個對方不可能接受的前題下，才願意當副 <br> - 侯腦想要用條件限制柯，真的科科笑 |

  // #### 總結：根據留言的分析，網友對於柯文哲與侯友宜的合作問題持有不同的看法。有些人認為柯文哲的做法是為了匯聚民間力量，達成政黨輪替的目標，並且提出了具體的辦法和數字，對於侯友宜的質疑感到不滿。另一方面，也有人認為侯友宜願意接受「柯侯配」，但柯文哲要回覆是否同意，否則進入政黨協商的態度是在限制柯文哲的選擇，並且對侯友宜的做法感到不滿。綜合來看，網友對於柯文哲與侯友宜的合作問題持有不同的觀點，並且對於侯友宜的做法有所質疑。
  // `;

  return (
    <Stack gap={3}>
      <Stack direction="horizontal" gap={3}>
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
      </Stack>
      {markdown == "loading" ? (
        <div class="loader"></div>
      ) : (
        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {markdown}
        </Markdown>
      )}
    </Stack>
  );
}

export default MarkdownBlocks;
