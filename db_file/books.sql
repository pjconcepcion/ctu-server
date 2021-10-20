USE [ctu-app]
GO

/****** Object:  Table [dbo].[books]    Script Date: 20/10/2021 9:45:44 pm ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[books]') AND type in (N'U'))
DROP TABLE [dbo].[books]
GO

/****** Object:  Table [dbo].[books]    Script Date: 20/10/2021 9:45:44 pm ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[books](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](100) NOT NULL,
	[author] [nvarchar](100) NOT NULL,
	[genre] [nvarchar](20) NOT NULL,
	[description] [nvarchar](200) NULL,
	[max_qty] [int] NOT NULL,
 CONSTRAINT [PK_books] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

