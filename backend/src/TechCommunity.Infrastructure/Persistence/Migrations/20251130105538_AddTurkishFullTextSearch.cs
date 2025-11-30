using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TechCommunity.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddTurkishFullTextSearch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create Turkish text search configuration
            migrationBuilder.Sql(@"
                -- Create Turkish text search configuration if not exists
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_ts_config WHERE cfgname = 'turkish'
                    ) THEN
                        CREATE TEXT SEARCH CONFIGURATION turkish (COPY = simple);
                    END IF;
                END $$;
            ");

            // Create function for updating Post search vector
            migrationBuilder.Sql(@"
                CREATE OR REPLACE FUNCTION update_post_search_vector()
                RETURNS trigger AS $$
                BEGIN
                    NEW.""SearchVector"" := 
                        setweight(to_tsvector('turkish', COALESCE(NEW.""Title"", '')), 'A') ||
                        setweight(to_tsvector('turkish', COALESCE(NEW.""Content"", '')), 'B');
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            ");

            // Create trigger for Posts
            migrationBuilder.Sql(@"
                DROP TRIGGER IF EXISTS post_search_vector_update ON ""Posts"";
                CREATE TRIGGER post_search_vector_update
                BEFORE INSERT OR UPDATE OF ""Title"", ""Content""
                ON ""Posts""
                FOR EACH ROW
                EXECUTE FUNCTION update_post_search_vector();
            ");

            // Create function for updating Question search vector
            migrationBuilder.Sql(@"
                CREATE OR REPLACE FUNCTION update_question_search_vector()
                RETURNS trigger AS $$
                BEGIN
                    NEW.""SearchVector"" := 
                        setweight(to_tsvector('turkish', COALESCE(NEW.""Title"", '')), 'A') ||
                        setweight(to_tsvector('turkish', COALESCE(NEW.""Body"", '')), 'B');
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            ");

            // Create trigger for Questions
            migrationBuilder.Sql(@"
                DROP TRIGGER IF EXISTS question_search_vector_update ON ""Questions"";
                CREATE TRIGGER question_search_vector_update
                BEFORE INSERT OR UPDATE OF ""Title"", ""Body""
                ON ""Questions""
                FOR EACH ROW
                EXECUTE FUNCTION update_question_search_vector();
            ");

            // Update existing records to populate search vectors
            migrationBuilder.Sql(@"
                UPDATE ""Posts"" SET ""SearchVector"" = 
                    setweight(to_tsvector('turkish', COALESCE(""Title"", '')), 'A') ||
                    setweight(to_tsvector('turkish', COALESCE(""Content"", '')), 'B');
            ");

            migrationBuilder.Sql(@"
                UPDATE ""Questions"" SET ""SearchVector"" = 
                    setweight(to_tsvector('turkish', COALESCE(""Title"", '')), 'A') ||
                    setweight(to_tsvector('turkish', COALESCE(""Body"", '')), 'B');
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop triggers
            migrationBuilder.Sql(@"DROP TRIGGER IF EXISTS post_search_vector_update ON ""Posts"";");
            migrationBuilder.Sql(@"DROP TRIGGER IF EXISTS question_search_vector_update ON ""Questions"";");

            // Drop functions
            migrationBuilder.Sql(@"DROP FUNCTION IF EXISTS update_post_search_vector();");
            migrationBuilder.Sql(@"DROP FUNCTION IF EXISTS update_question_search_vector();");

            // Drop Turkish text search configuration
            migrationBuilder.Sql(@"DROP TEXT SEARCH CONFIGURATION IF EXISTS turkish;");

            // Clear search vectors
            migrationBuilder.Sql(@"UPDATE ""Posts"" SET ""SearchVector"" = NULL;");
            migrationBuilder.Sql(@"UPDATE ""Questions"" SET ""SearchVector"" = NULL;");
        }
    }
}
