import { pool } from "../config/db.js";
import { renderTemplate } from "../utils/seoRenderer.js";

export async function getBlogBySlug(slug) {
  if (!slug) return null;

  const [[blog]] = await pool.query(
    `
    SELECT
      id,
      title,
      excerpt,
      slug
    FROM blogs
    WHERE slug = ?
      AND status = 'published'
    LIMIT 1
    `,
    [slug],
  );
  return blog || null;
}

export async function getCategoryBySlug(slug) {
  if (!slug) return null;
  const [[category]] = await pool.query(
    `
    SELECT
      id,
      name,
      slug
    FROM categories
    WHERE slug = ?
    LIMIT 1
    `,
    [slug],
  );
  console.log(category);

  return category || null;
}

export async function getProgramById(id) {
  if (!id) return null;

  const [[program]] = await pool.query(
    `
    SELECT
      id,
      goal,
      start_weight,
      target_weight,
      target_months
    FROM programs
    WHERE id = ?
    LIMIT 1
    `,
    [id],
  );

  return program || null;
}

function goalToTitle(goal) {
  switch (goal) {
    case "lose":
      return "Kilo Verme Planı";
    case "gain":
      return "Kilo Alma Planı";
    case "maintain":
      return "Kilo Koruma Planı";
    default:
      return "Diyet Programı";
  }
}

export const renderSeo = async (req, res) => {
  const { page_key, slug } = req.query;

  const [[seo]] = await pool.query(
    `SELECT * FROM seo_settings WHERE page_key=? AND status=1 LIMIT 1`,
    [page_key],
  );

  if (!seo) return res.json({});

  let data = {};

  // 🧠 SAYFA BAĞLAMINA GÖRE VERİ TOPLA
  if (page_key === "blog_detail" && slug) {
    const blog = await getBlogBySlug(slug);
    if (blog) {
      data = {
        title: blog.title,
        excerpt: blog.excerpt,
        slug: blog.slug,
      };
    }
  }

  if (page_key === "category_detail" && slug) {
    const category = await getCategoryBySlug(slug);
    if (category) {
      data = {
        category: category.name,
        slug: category.slug,
      };
    }
  }
  if (page_key === "program_detail" && slug) {
    console.log("object");
    const program = await getProgramById(slug);
    console.log("pro", program);
    if (program) {
      const baseTitle = goalToTitle(program.goal);

      data = {
        program_title: baseTitle,
        program_no: program.id,
        goal: program.goal,
        start_weight: program.start_weight,
        target_weight: program.target_weight,
        target_months: program.target_months,
        slug: program.id,
      };
    }
  }

  res.json({
    title: renderTemplate(seo.title, data),
    description: renderTemplate(seo.description, data),
    canonical: seo.canonical ? renderTemplate(seo.canonical, data) : null,
    robots: seo.robots || "index, follow",
  });
};
