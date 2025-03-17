
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Dumbbell, ChevronRight, BarChart, ListChecks, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      {/* Navigation */}
      <header className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-xl font-semibold">
            <span className="text-primary font-bold">Track</span>Fit
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="text-muted-foreground hover:text-foreground"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate('/register')}
          >
            Registrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between py-16 lg:py-24 gap-12">
          <motion.div 
            className="flex-1 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                Acompanhe sua evolução
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Sua jornada fitness<br />
              <span className="text-primary">em um só lugar</span>
            </motion.h1>

            <motion.p 
              className="text-muted-foreground text-lg mb-8 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Gerencie exercícios, registre treinos e acompanhe seu progresso com uma interface intuitiva e elegante.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Button size="lg" onClick={() => navigate('/register')}>
                Começar agora
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>

              <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                Já tenho uma conta
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex-1 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="relative w-full max-w-md">
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl" />
              <Card className="glass-card backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="ml-3 font-semibold">Treino de Hoje</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Supino Reto</div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Peito</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-background/50 p-2 rounded flex justify-between">
                          <span className="text-muted-foreground">Set 1</span>
                          <span>80kg × 10</span>
                        </div>
                        <div className="bg-background/50 p-2 rounded flex justify-between">
                          <span className="text-muted-foreground">Set 2</span>
                          <span>80kg × 8</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Puxada Frontal</div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Costas</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-background/50 p-2 rounded flex justify-between">
                          <span className="text-muted-foreground">Set 1</span>
                          <span>70kg × 12</span>
                        </div>
                        <div className="bg-background/50 p-2 rounded flex justify-between">
                          <span className="text-muted-foreground">Set 2</span>
                          <span>70kg × 10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <div className="container mx-auto px-4 py-16">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div variants={item}>
              <h2 className="text-3xl font-bold mb-4">Recursos</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tudo o que você precisa para monitorar seu progresso na academia de forma eficiente e organizada.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={item}>
              <Card className="glass-card h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Exercícios Personalizados</h3>
                  <p className="text-muted-foreground mb-4">
                    Crie e organize uma biblioteca de exercícios categorizados por grupos musculares.
                  </p>
                  <div className="mt-auto">
                    <Button variant="ghost" className="group p-0" onClick={() => navigate('/register')}>
                      <span>Começar agora</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="glass-card h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <ListChecks className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Acompanhamento de Treinos</h3>
                  <p className="text-muted-foreground mb-4">
                    Registre detalhes como peso, repetições e sets para cada exercício do seu treino.
                  </p>
                  <div className="mt-auto">
                    <Button variant="ghost" className="group p-0" onClick={() => navigate('/register')}>
                      <span>Começar agora</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="glass-card h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Análise de Progresso</h3>
                  <p className="text-muted-foreground mb-4">
                    Veja métricas e estatísticas para acompanhar sua evolução ao longo do tempo.
                  </p>
                  <div className="mt-auto">
                    <Button variant="ghost" className="group p-0" onClick={() => navigate('/register')}>
                      <span>Começar agora</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border mt-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© 2025 TrackFit. Todos os direitos reservados.</p>
          <div className="flex items-center mt-4 sm:mt-0">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Termos
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Privacidade
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
