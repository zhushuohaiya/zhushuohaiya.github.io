---
title: 初步接触Agent
date: 2025-12-31 17:55:03
categories: [科研]
tags: [Agent]
---

# 什么是agent？

agent的中文为代理，代理商。不过在这里，翻译为“**智能体**”更合适。传统的大语言模型是没有感知能力的。所谓感知能力，也就是真正的从“说”到“做”，传统的大语言模型是只能够输出文，图，视频等，供我们阅读和参考。而agent就是为大语言模型添加了“手”（工具），让其可以直接对现实的电脑，我们的项目等做出相应的改变。泛泛的来说说，agent＝llm+tools。

cursor是一个用于编程的agent，我们只需要输入命令，便可以直接在项目中进行代码的修改等，直接完成我们想要的效果。（trae，Manus也如此）

# 什么是ReAct?

ReAct(Reasoning and Acting)是一种对agent进行约束的运行模式。它最早是由目前已被任命为腾讯首席ai科学家的姚顺雨在2022年发的一篇文章中提出的概念，目前仍然是使用最为广泛的应用模式。它可以简要概括为，用户输入question，agent先进行thought，然后判断是否需要action，之后obeservation（观察），判断执行的正确性。之后继续thought，action，obeservation，直到完成了用户要求的question，得到final answer。

![ReAct流程图](/img/Agent/ReAct流程图.png)

# ReAct的实现原理：

ReAct实现的关键在于系统提示词。系统提示词有别于用户输入的问题，是事先对llm做的预设，按照一个标准的模板来进行思考，行动，观察，输出，并告诉llm可调用的工具，运行环境等。

以下是一个系统提示词的示例（Python字符串）：
```Xml


react_system_prompt_template = """

你需要解决一个问题。为此，你需要将问题分解为多个步骤。对于每个步骤，首先使用 <thought> 思考要做什么，然后使用可用工具之一决定一个 <action>。接着，你将根据你的行动从环境/工具中收到一个 <observation>。持续这个思考和行动的过程，直到你有足够的信息来提供 <final_answer>。

  

所有步骤请严格使用以下 XML 标签格式输出：

- <question> 用户问题

- <thought> 思考

- <action> 采取的工具操作

- <observation> 工具或环境返回的结果

- <final_answer> 最终答案

  

⸻

  

例子 1:

  

<question>埃菲尔铁塔有多高？</question>

<thought>我需要找到埃菲尔铁塔的高度。可以使用搜索工具。</thought>

<action>get_height("埃菲尔铁塔")</action>

<observation>埃菲尔铁塔的高度约为330米（包含天线）。</observation>

<thought>搜索结果显示了高度。我已经得到答案了。</thought>

<final_answer>埃菲尔铁塔的高度约为330米。</final_answer>

  

⸻

  

例子 2:

  

<question>帮我找一个简单的番茄炒蛋食谱，并看看家里的冰箱里有没有西红柿。</question>

<thought>这个任务分两步。第一步，找到番茄炒蛋的食谱。第二步，检查冰箱里是否有西红柿。我先用 find_recipe 工具找食谱。</thought>

<action>find_recipe(dish="番茄炒蛋")</action>

<observation>简单的番茄炒蛋食谱：将2个鸡蛋打散，2个番茄切块。热油，先炒鸡蛋，盛出。再热油，炒番茄至软烂，加入鸡蛋，放盐调味即可。</observation>

<thought>好的，我已经有食谱了。食谱需要西红柿。现在我需要用 check_fridge 工具看看冰箱里有没有西红柿。</thought>

<action>check_fridge(item="西红柿")</action>

<observation>冰箱检查结果：有3个西红柿。</observation>

<thought>我找到了食谱，并且确认了冰箱里有西红柿。可以回答问题了。</thought>

<final_answer>简单的番茄炒蛋食谱是：鸡蛋打散，番茄切块。先炒鸡蛋，再炒番茄，混合后加盐调味。冰箱里有3个西红柿。</final_answer>

  

⸻

  

请严格遵守：

- 你每次回答都必须包括两个标签，第一个是 <thought>，第二个是 <action> 或 <final_answer>

- 输出 <action> 后立即停止生成，等待真实的 <observation>，擅自生成 <observation> 将导致错误

- 如果 <action> 中的某个工具参数有多行的话，请使用 \n 来表示，如：<action>write_to_file("/tmp/test.txt", "a\nb\nc")</action>

- 工具参数中的文件路径请使用绝对路径，不要只给出一个文件名。比如要写 write_to_file("/tmp/test.txt", "内容")，而不是 write_to_file("test.txt", "内容")

  

⸻

  

本次任务可用工具：

${tool_list}

  

⸻



环境信息：

  

操作系统：${operating_system}

当前目录下文件列表：${file_list}

"""
```

通过这种预设，我们就可以编写相应配套的代码，在命令行或者ide中执行一个简单的符合ReAct运行模式的demo。

# 只有这一种流程管控模式吗？

还有其他的，比如plan and execute，用户question以后，agent先给出plan，然后开始执行，并把执行结果和plan以及question作为下一次输入，进行re-plan，反复执行直至得到结果。（re-plan的两个功能：输出下一次计划或给出final answer）

# 参考文献
[1] MarkTechStation. (2025). VideoCode [Computer software]. GitHub. https://github.com/MarkTechStation/VideoCode

[2] Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., & Cao, Y. (2023). ReAct: Synergizing reasoning and acting in language models. In International Conference on Learning Representations (ICLR).