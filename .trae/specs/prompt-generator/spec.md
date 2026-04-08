# 提示词生成器 - Product Requirement Document

## Overview
- **Summary**: 一个现代化的提示词生成器Web应用，帮助用户快速创建和优化用于各种AI工具（如ChatGPT、Midjourney、DALL-E等）的提示词。
- **Purpose**: 解决用户在编写高质量AI提示词时遇到的困难，提供直观的界面和模板来简化提示词创作流程。
- **Target Users**: AI工具用户、内容创作者、开发者、设计师等需要使用AI生成工具的人群。

## Goals
- 提供直观的提示词生成界面
- 支持多种AI工具的提示词模板
- 允许用户保存和管理自己的提示词
- 支持提示词历史记录和导出功能
- 提供响应式设计，支持多种设备

## Non-Goals (Out of Scope)
- 不直接集成AI API调用功能
- 不包含用户身份验证系统（第一版）
- 不包含高级协作功能
- 不提供复杂的数据分析功能

## Background & Context
- 随着AI工具的普及，高质量提示词的需求日益增长
- 大多数用户不了解如何编写有效的提示词
- 现有的提示词工具要么过于复杂，要么功能有限

## Functional Requirements
- **FR-1**: 用户可以通过表单界面生成提示词
- **FR-2**: 提供多种AI工具的预设模板
- **FR-3**: 支持自定义提示词参数
- **FR-4**: 用户可以复制生成的提示词
- **FR-5**: 支持提示词历史记录功能
- **FR-6**: 支持提示词导出功能
- **FR-7**: 提供响应式布局，适配桌面和移动设备

## Non-Functional Requirements
- **NFR-1**: 页面加载时间 < 2秒
- **NFR-2**: 支持现代浏览器（Chrome、Firefox、Safari、Edge）
- **NFR-3**: 界面设计美观现代
- **NFR-4**: 代码结构清晰，易于维护和扩展

## Constraints
- **Technical**: 使用React + Vite + Tailwind CSS构建
- **Business**: 第一版为MVP版本，专注核心功能
- **Dependencies**: 不需要后端服务，使用localStorage存储数据

## Assumptions
- 用户具有基本的Web浏览器使用经验
- 用户了解基本的AI工具概念
- 浏览器支持localStorage

## Acceptance Criteria

### AC-1: 提示词生成功能
- **Given**: 用户在提示词生成页面
- **When**: 用户填写表单并点击生成按钮
- **Then**: 系统生成符合要求的提示词并显示在界面上
- **Verification**: `programmatic`

### AC-2: 模板选择功能
- **Given**: 用户在提示词生成页面
- **When**: 用户选择一个预设模板
- **Then**: 表单自动填充该模板的默认参数
- **Verification**: `programmatic`

### AC-3: 复制功能
- **Given**: 提示词已生成并显示
- **When**: 用户点击复制按钮
- **Then**: 提示词被复制到剪贴板，并显示成功提示
- **Verification**: `programmatic`

### AC-4: 历史记录功能
- **Given**: 用户已生成过提示词
- **When**: 用户访问历史记录页面
- **Then**: 显示用户之前生成的所有提示词
- **Verification**: `programmatic`

### AC-5: 响应式布局
- **Given**: 用户使用不同尺寸的设备访问
- **When**: 页面加载
- **Then**: 界面自动适配设备屏幕尺寸
- **Verification**: `human-judgment`

### AC-6: 导出功能
- **Given**: 用户在历史记录页面
- **When**: 用户选择导出提示词
- **Then**: 提示词以文本或JSON格式下载
- **Verification**: `programmatic`

## Open Questions
- [ ] 是否需要添加用户账号系统？
- [ ] 是否需要支持提示词分享功能？
- [ ] 未来是否需要集成AI API直接调用？
