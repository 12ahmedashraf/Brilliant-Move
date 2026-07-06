import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const badges = [
    { name: "Pawn", chess_piece: "pawn", points_threshold: 0, description: "Every master was once a beginner." },
    { name: "Knight", chess_piece: "knight", points_threshold: 30, description: "You think in L-shapes." },
    { name: "Bishop", chess_piece: "bishop", points_threshold: 60, description: "You see diagonals others miss." },
    { name: "Rook", chess_piece: "rook", points_threshold: 100, description: "Straight-line focus, unstoppable." },
    { name: "Queen", chess_piece: "queen", points_threshold: 150, description: "Versatile, powerful, dominant." },
    { name: "King", chess_piece: "king", points_threshold: 200, description: "The crown is yours." },
  ];

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.from("badges").upsert(badges, {
    onConflict: "points_threshold",
    ignoreDuplicates: false,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true, badges: data });
}
