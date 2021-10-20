USE [ctu-app]
GO

ALTER TABLE [dbo].[borrowed_books] DROP CONSTRAINT [FK__borrowed___book___5EBF139D]
GO

ALTER TABLE [dbo].[borrowed_books] DROP CONSTRAINT [DF__borrowed___date___5DCAEF64]
GO

/****** Object:  Table [dbo].[borrowed_books]    Script Date: 20/10/2021 9:45:54 pm ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[borrowed_books]') AND type in (N'U'))
DROP TABLE [dbo].[borrowed_books]
GO

/****** Object:  Table [dbo].[borrowed_books]    Script Date: 20/10/2021 9:45:54 pm ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[borrowed_books](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](150) NOT NULL,
	[book_id] [int] NOT NULL,
	[date_borrowed] [date] NOT NULL,
 CONSTRAINT [PK_borrowed_books] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[borrowed_books] ADD  DEFAULT (getdate()) FOR [date_borrowed]
GO

ALTER TABLE [dbo].[borrowed_books]  WITH CHECK ADD FOREIGN KEY([book_id])
REFERENCES [dbo].[books] ([id])
GO

