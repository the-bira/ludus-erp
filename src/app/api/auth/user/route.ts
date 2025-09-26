import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: "UID é obrigatório" }, { status: 400 });
    }

    // Buscar dados do usuário no Firestore
    const userDoc = await db.collection("usuarios").doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    return NextResponse.json({
      nome: userData?.nome,
      email: userData?.email,
      tipo: userData?.tipo,
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
